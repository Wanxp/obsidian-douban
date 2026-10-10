jest.mock("obsidian", () => ({
	getLanguage: () => "zh-CN",
	moment: (value: any) => ({format: () => String(value)}),
	Platform: {isDesktopApp: true},
	normalizePath: (value: string) => value,
}), {virtual: true});

import {load} from "cheerio";
import DoubanMovieLoadHandler from "../src/org/wanxp/douban/data/handler/DoubanMovieLoadHandler";
import {DoubanTeleplayLoadHandler} from "../src/org/wanxp/douban/data/handler/DoubanTeleplayLoadHandler";
import {DEFAULT_SETTINGS} from "../src/org/wanxp/constant/DefaultSettings";
import {SearchHandleMode} from "../src/org/wanxp/constant/Constsant";
import {FileUtil} from "../src/org/wanxp/utils/FileUtil";

// Minimal public movie metadata. The I Origins title strings were verified
// against subject 24696982; this fixture contains no account or review data.
function page(title: string, name: string, type = "Movie", suffix = " (豆瓣)") {
	const html = load("<html><head><title></title></head><body></body></html>");
	html("title").text(`\n  ${title}${suffix}\n`);
	html("head").append('<meta property="og:title"><script type="application/ld+json"></script>');
	html("meta").attr("content", name);
	html("script").text(JSON.stringify({"@type": type, name, url: "/subject/24696982/"}));
	return html;
}

const settings = {...DEFAULT_SETTINGS, cacheImage: false};
const plugin = {settingsManager: {getSetting: (key: keyof typeof settings) => settings[key]}} as any;
const context = {settings, userComponent: {isLogin: () => false}, mode: SearchHandleMode.FOR_CREATE} as any;

describe.each([
	["movie", new DoubanMovieLoadHandler(plugin)],
	["teleplay", new DoubanTeleplayLoadHandler(plugin)],
] as const)("%s titles without a search result", (type, handler) => {
	const schemaType = type === "teleplay" ? "TVSeries" : "Movie";
	it.each([
		["I型起源", "I型起源 I Origins", "I Origins"],
		["I 型起源", "I 型起源 I Origins", "I Origins"],
		["Hello！树先生", "Hello！树先生", "Hello！树先生"],
		["头文字D", "头文字D Initial D", "Initial D"],
		["皮囊之下", "皮囊之下 Under the Skin", "Under the Skin"],
		["Under the Skin", "Under the Skin", "Under the Skin"],
	])("preserves %s and separates its original title", (title, name, originalTitle) => {
		expect(handler.parseSubjectFromHtml(page(title, name, schemaType), context)).toMatchObject({title, originalTitle});
	});

	it("keeps the selected search title when it differs from the page title", () => {
		expect(handler.parseSubjectFromHtml(page("页面标题", "I型起源 I Origins", schemaType), {
			...context, listItem: {title: "I型起源"},
		} as any)).toMatchObject({title: "I型起源", originalTitle: "I Origins"});
	});

	it("retains the legacy fallback if no Douban document title is available", () => {
		expect(handler.parseSubjectFromHtml(page("", "皮囊之下 Under the Skin", schemaType, ""), context))
			.toMatchObject({title: "皮囊之下", originalTitle: "Under the Skin"});
	});
});

it.each(["URL import", "sync"])("uses the preserved title in Markdown and its filename during %s", async mode => {
	const handler = new DoubanMovieLoadHandler(plugin);
	const importContext = mode === "sync" ? {
		...context, syncActive: true,
		syncConfig: {dataFilePath: "", dataFileNamePath: settings.dataFileNamePath},
	} as any : context;
	const subject = handler.parseSubjectFromHtml(page("I型起源", "I型起源 I Origins"), importContext);
	jest.spyOn(handler as any, "getTemplate").mockResolvedValue("---\ntitle: {{title}}\n---\n# {{title}}\n");
	const result = await handler.parse(subject, importContext);
	expect(result.content).toContain("title: I型起源");
	expect(result.fileName).toBe("/movie/I型起源");
	expect(FileUtil.parse(result.fileName).name).toBe("I型起源");
});
