jest.mock("obsidian", () => ({
	getLanguage: () => "zh-CN",
	moment: (value: unknown) => ({ format: () => String(value) }),
	Notice: jest.fn(),
	Platform: { isDesktopApp: true },
}), { virtual: true });
jest.mock("../src/org/wanxp/utils/TimeUtil", () => ({ sleepRange: jest.fn().mockResolvedValue(undefined) }));

import { DoubanMovieSyncHandler } from "../src/org/wanxp/douban/sync/handler/DoubanMovieSyncHandler";
import { DoubanTeleplaySyncHandler } from "../src/org/wanxp/douban/sync/handler/DoubanTeleplaySyncHandler";
import { DoubanBookSyncHandler } from "../src/org/wanxp/douban/sync/handler/DoubanBookSyncHandler";
import { DoubanMusicSyncHandler } from "../src/org/wanxp/douban/sync/handler/DoubanMusicSyncHandler";
import { DoubanGameSyncHandler } from "../src/org/wanxp/douban/sync/handler/DoubanGameSyncHandler";
import DoubanAbstractLoadHandler from "../src/org/wanxp/douban/data/handler/DoubanAbstractLoadHandler";
import SyncStatusHolder from "../src/org/wanxp/douban/sync/model/SyncStatusHolder";
import { SyncConfig } from "../src/org/wanxp/douban/sync/model/SyncConfig";
import HandleContext from "../src/org/wanxp/douban/data/model/HandleContext";
import { DoubanHttpUtil } from "../src/org/wanxp/utils/DoubanHttpUtil";
import { PAGE_SIZE, SyncConditionType, SyncType, SyncItemStatus } from "../src/org/wanxp/constant/Constsant";
import DoubanPlugin from "../src/org/wanxp/main";
import { DoubanSyncHandler } from "../src/org/wanxp/douban/sync/handler/DoubanSyncHandler";
import { ALL } from "../src/org/wanxp/constant/DoubanUserState";

const states = ["collect", "wish", "do"] as const;
type State = typeof states[number];
interface Item { id: string; date: string; }
type Lists = Record<State, Item[]>;
const rows = (count: number, base: number, date = "2026-09-20"): Item[] =>
	Array.from({ length: count }, (_, i) => ({ id: String(base + i), date }));
const lists = (collect = 1, wish = 1, doing = 1): Lists => ({
	collect: rows(collect, 10000), wish: rows(wish, 20000), do: rows(doing, 30000),
});

// Synthetic HTML only. Exercise actual URLs and list parsers without cookies or live requests.
function setup(data: Lists, options: Partial<SyncConfig> = {}, Handler: new (plugin: DoubanPlugin) => DoubanSyncHandler = DoubanMovieSyncHandler) {
	let active = true;
	const config = {
		syncType: SyncType.movie, scope: ALL, syncConditionType: SyncConditionType.ALL,
		syncConditionCountFromValue: 1, syncConditionCountToValue: 0,
		incrementalUpdate: true, dataFilePath: "test-output", ...options,
	} as SyncConfig;
	const status = new SyncStatusHolder(config);
	status.initSyncHandledData([]);
	const plugin = {
		statusHolder: { syncing: () => active, syncStatus: status },
		settingsManager: { getHeaders: () => ({}) },
	};
	const context = {
		plugin, syncStatusHolder: { syncStatus: status }, syncConfig: config,
		userComponent: { getUserId: () => "fixture-user" },
	} as unknown as HandleContext;
	const requests: { state: State; offset: number }[] = [];
	const network = jest.spyOn(DoubanHttpUtil, "httpRequestGet").mockImplementation(async (address) => {
		const url = new URL(address);
		const state = (url.searchParams.get("action") || url.pathname.split("/").pop()) as State;
		const offset = Number(url.searchParams.get("start"));
		requests.push({ state, offset });
		const items = data[state].slice(offset, offset + PAGE_SIZE);
		return `<div class="subject-num">${offset + 1}-${offset + items.length} / ${data[state].length}</div>
			<div class="tabs"><a>玩过(${data.collect.length})</a><a>想玩(${data.wish.length})</a><a>在玩(${data.do.length})</a></div>`
			+ items.map((item) => `<div class="item-show common-item"><div class="title">
				<a href="https://movie.douban.com/subject/${item.id}/">Synthetic ${item.id}</a></div>
				<div class="date">${item.date}</div><span class="date">${item.date}</span></div>`).join("");
	});
	const imported: string[] = [];
	const loader = jest.spyOn(DoubanAbstractLoadHandler.prototype, "handle").mockImplementation(async (id) => {
		imported.push(id);
		status.create(id, `Synthetic ${id}`);
		return undefined;
	});
	const handler = new Handler(plugin as never);
	return { config, context, status, requests, imported, network, loader, handler,
		cancel: () => { active = false; },
		run: () => handler.sync(config, context) };
}

function expectStatistics(env: ReturnType<typeof setup>, total: number, allTotal = total) {
	expect(env.status.getTotal()).toBe(total);
	expect(env.status.getAllTotal()).toBe(allTotal);
	expect(env.status.getHasHandle()).toBe(total);
	expect(env.status.getNeedHandled()).toBe(0);
}

afterEach(() => jest.restoreAllMocks());

describe("collection status synchronization", () => {
	it.each([
		["movie", DoubanMovieSyncHandler], ["teleplay", DoubanTeleplaySyncHandler],
		["book", DoubanBookSyncHandler], ["music", DoubanMusicSyncHandler], ["game", DoubanGameSyncHandler],
	])("imports all three statuses with independent pages for %s", async (_, Handler) => {
		const data = lists(PAGE_SIZE + 2, PAGE_SIZE + 1, 2);
		const env = setup(data, {}, Handler);
		await env.run();
		expect(env.imported).toEqual(states.flatMap((state) => data[state].map((item) => item.id)));
		for (const state of states) {
			expect(env.requests.filter((request) => request.state == state).map((request) => request.offset))
				.toEqual(state == "do" ? [0] : [0, PAGE_SIZE]);
		}
		expectStatistics(env, PAGE_SIZE * 2 + 5);
	});

	it.each(states)("keeps a single %s selection isolated", async (scope) => {
		const data = lists(2, 3, 4);
		const env = setup(data, { scope });
		await env.run();
		expect(env.imported).toEqual(data[scope].map((item) => item.id));
		expect(env.requests.every((request) => request.state == scope)).toBe(true);
		expectStatistics(env, data[scope].length);
	});

	it.each(states)("continues when %s is empty", async (state) => {
		const data = lists();
		data[state] = [];
		const env = setup(data);
		await env.run();
		expect(env.imported).toHaveLength(2);
		expectStatistics(env, 2);
	});

	it("advances past an entirely cached page and persists the original ALL cache key", async () => {
		const data = lists(PAGE_SIZE + 1, 2, 1);
		const env = setup(data);
		const key = env.status.getKey(env.config);
		env.status.initSyncHandledData([{ key, value: data.collect.slice(0, PAGE_SIZE).map((item) => item.id) }]);
		await env.run();
		expect(env.imported).toEqual([data.collect[PAGE_SIZE].id, ...data.wish.map((item) => item.id), data.do[0].id]);
		expect(env.status.statusHandleMap.get(SyncItemStatus.unHandle)).toBe(PAGE_SIZE);
		expect(env.status.handledData.get(key).size).toBe(PAGE_SIZE + 4);
		expectStatistics(env, PAGE_SIZE + 4);
	});

	it("deduplicates repeated subjects without inflating statistics, even without incremental updates", async () => {
		const data = lists();
		data.wish = [...data.collect];
		const env = setup(data, { incrementalUpdate: false });
		await env.run();
		expect(env.imported).toEqual(["10000", "30000"]);
		expectStatistics(env, 2, 3);
	});

	it("stops subsequent imports and page requests after cancellation", async () => {
		const env = setup(lists(PAGE_SIZE + 1, 2, 1));
		env.loader.mockImplementation(async (id) => {
			env.imported.push(id);
			env.status.create(id, "Synthetic");
			env.cancel();
			return undefined;
		});
		await env.run();
		expect(env.imported).toEqual(["10000"]);
		expect(env.requests).toHaveLength(3); // Only the initial pages used to establish total.
		expect(env.status.getTotal()).toBe(PAGE_SIZE + 4);
		expect(env.status.getHasHandle()).toBe(1);
		expect(env.status.getNeedHandled()).toBe(PAGE_SIZE + 3);
	});

	it("discards an in-flight list response after cancellation", async () => {
		const env = setup(lists());
		const respond = env.network.getMockImplementation();
		env.network.mockImplementation(async (...args) => { env.cancel(); return respond(...args); });
		await env.run();
		expect(env.imported).toEqual([]);
		expect(env.requests).toHaveLength(1);
	});

	it.each([ALL, ...states])("applies an inclusive cross-page count range independently for scope %s", async (scope) => {
		const data = lists(PAGE_SIZE + 4, PAGE_SIZE + 2, PAGE_SIZE - 1);
		const env = setup(data, { scope, syncConditionType: SyncConditionType.CUSTOM_ITEM,
			syncConditionCountFromValue: PAGE_SIZE - 1, syncConditionCountToValue: PAGE_SIZE + 3 });
		await env.run();
		const selectedStates: readonly State[] = scope == ALL ? states : [scope as State];
		expect(env.imported).toEqual(selectedStates.flatMap((state) => data[state].slice(PAGE_SIZE - 2, PAGE_SIZE + 3).map((item) => item.id)));
		expectStatistics(env, scope == ALL ? 10 : scope == "collect" ? 5 : scope == "wish" ? 4 : 1,
			selectedStates.reduce((sum, state) => sum + data[state].length, 0));
	});

	it("starts a later-page count range afresh for each state and allows an open end", async () => {
		const data = lists(PAGE_SIZE + 2, 0, PAGE_SIZE + 1);
		const env = setup(data, { syncConditionType: SyncConditionType.CUSTOM_ITEM, syncConditionCountFromValue: PAGE_SIZE + 1 });
		await env.run();
		expect(env.imported).toEqual(["10030", "10031", "30030"]);
		expect(env.requests.map((request) => request.offset)).toEqual([PAGE_SIZE, PAGE_SIZE, PAGE_SIZE]);
		expectStatistics(env, 3, PAGE_SIZE * 2 + 3);
	});

	it("takes the first thirty of each state", async () => {
		const env = setup(lists(35, 31, 2), { syncConditionType: SyncConditionType.LAST_THIRTY });
		await env.run();
		expect(env.imported).toHaveLength(62);
		expect(env.requests).toHaveLength(3);
		expectStatistics(env, 62, 68);
	});

	it.each([ALL, ...states])("filters inclusive dates across independent pages for scope %s", async (scope) => {
		const data = lists(0, 0, 0);
		for (const [index, state] of states.entries()) {
			data[state] = [...rows(PAGE_SIZE, 10000 + index * 10000, "2026-09-30"),
				...rows(2, 10100 + index * 10000, "2026-09-20"), ...rows(1, 10200 + index * 10000, "2026-09-01")];
		}
		const env = setup(data, { scope, syncConditionType: SyncConditionType.CUSTOM_TIME,
			syncConditionDateFromValue: new Date("2026-09-20"), syncConditionDateToValue: new Date("2026-09-20") });
		await env.run();
		const selectedStates: readonly State[] = scope == ALL ? states : [scope as State];
		expect(env.imported).toEqual(selectedStates.flatMap((state) => data[state].slice(PAGE_SIZE, PAGE_SIZE + 2).map((item) => item.id)));
		expectStatistics(env, selectedStates.length * 2, selectedStates.length * (PAGE_SIZE + 3));
	});

	it.each(["from", "to"])("allows an open date range (%s only) and continues after an empty date result", async (bound) => {
		const data = lists();
		data.collect[0].date = bound == "from" ? "2026-09-01" : "2026-09-30";
		const env = setup(data, { syncConditionType: SyncConditionType.CUSTOM_TIME,
			syncConditionDateFromValue: bound == "from" ? new Date("2026-09-20") : undefined,
			syncConditionDateToValue: bound == "to" ? new Date("2026-09-20") : undefined });
		await env.run();
		expect(env.imported).toEqual(["20000", "30000"]);
		expectStatistics(env, 2, 3);
	});
	it("does not request an extra page at an exact page boundary", async () => {
		const env = setup(lists(PAGE_SIZE, 0, PAGE_SIZE));
		await env.run();
		expect(env.requests).toHaveLength(3);
		expectStatistics(env, PAGE_SIZE * 2);
	});

	it("returns zero selected items for an out-of-range count without stopping other states", async () => {
		const env = setup(lists(2, PAGE_SIZE + 1, 0), {
			syncConditionType: SyncConditionType.CUSTOM_ITEM, syncConditionCountFromValue: PAGE_SIZE + 1,
		});
		await env.run();
		expect(env.imported).toEqual(["20030"]);
		expectStatistics(env, 1, PAGE_SIZE + 3);
	});

	it("continues other states after a premature empty page and retains unprocessed statistics", async () => {
		const env = setup(lists(PAGE_SIZE + 1, 1, 1));
		const respond = env.network.getMockImplementation();
		env.network.mockImplementation(async (...args) => {
			const url = new URL(args[0]);
			if (url.pathname.endsWith("/collect") && url.searchParams.get("start") == String(PAGE_SIZE)) {
				return "<div class=\"subject-num\">0 / 31</div>";
			}
			return respond(...args);
		});
		await env.run();
		expect(env.imported).toHaveLength(PAGE_SIZE + 2);
		expect(env.imported.slice(-2)).toEqual(["20000", "30000"]);
		expect(env.status.getNeedHandled()).toBe(1);
	});

	it("skips cached subjects within a date range while counting them as ignored", async () => {
		const env = setup(lists(), { syncConditionType: SyncConditionType.CUSTOM_TIME,
			syncConditionDateFromValue: new Date("2026-09-20"), syncConditionDateToValue: new Date("2026-09-20") });
		env.status.initSyncHandledData([{ key: env.status.getKey(env.config), value: ["20000"] }]);
		await env.run();
		expect(env.imported).toEqual(["10000", "30000"]);
		expect(env.status.statusHandleMap.get(SyncItemStatus.unHandle)).toBe(1);
		expectStatistics(env, 3);
	});

	it("does not import date candidates when cancelled during pagination", async () => {
		const env = setup(lists(PAGE_SIZE + 1, 1, 1), { syncConditionType: SyncConditionType.CUSTOM_TIME,
			syncConditionDateFromValue: new Date("2026-09-20") });
		const respond = env.network.getMockImplementation();
		env.network.mockImplementation(async (...args) => {
			if (new URL(args[0]).searchParams.get("start") == String(PAGE_SIZE)) { env.cancel(); }
			return respond(...args);
		});
		await env.run();
		expect(env.imported).toEqual([]);
		expect(env.status.getHasHandle()).toBe(0);
		expect(env.status.getNeedHandled()).toBe(PAGE_SIZE);
		expect(env.status.getAllTotal()).toBe(PAGE_SIZE + 3);
	});

	it("retains the out-of-range message for a single status", async () => {
		const env = setup(lists(2, 1, 1), { scope: "collect", syncConditionType: SyncConditionType.CUSTOM_ITEM,
			syncConditionCountFromValue: PAGE_SIZE + 1 });
		await env.run();
		expect(env.imported).toEqual([]);
		expect(env.status.getMessage()).not.toBe("");
		expectStatistics(env, 0, 2);
	});

});
