import DoubanPlugin from "../../../main";
import { BasicConst, PAGE_SIZE, SyncConditionType, SyncType } from "../../../constant/Constsant";
import { DoubanSyncHandler } from "./DoubanSyncHandler";
import { SyncConfig } from "../model/SyncConfig";
import HandleContext from "../../data/model/HandleContext";
import { SubjectListItem } from "../../data/model/SubjectListItem";
import { sleepRange } from "../../../utils/TimeUtil";
import DoubanSubjectLoadHandler from "../../data/handler/DoubanSubjectLoadHandler";
import { DoubanListHandler } from "./list/DoubanListHandler";
import DoubanSubject from "../../data/model/DoubanSubject";
import { log } from "../../../utils/Logutil";
import { i18nHelper } from "../../../lang/helper";
import { SearchPageTypeOf } from "../../data/model/SearchPageTypeOf";

interface SyncListPlan {
	handler: DoubanListHandler;
	context: HandleContext;
	firstPage: SearchPageTypeOf<SubjectListItem>;
	from: number;
	to: number;
}

export abstract class DoubanAbstractSyncHandler<T extends DoubanSubject>
	implements DoubanSyncHandler
{
	constructor(
		private plugin: DoubanPlugin,
		private doubanSubjectLoadHandler: DoubanSubjectLoadHandler<T>,
		private doubanListHandlers: DoubanListHandler[],
	) {}

	support(t: string): boolean {
		return this.getSyncType() == t;
	}

	abstract getSyncType(): SyncType;

	async sync(syncConfig: SyncConfig, context: HandleContext): Promise<void> {
		if (!Object.values(SyncConditionType).includes(syncConfig.syncConditionType as SyncConditionType)) {
			log.warn(i18nHelper.getMessage("110083"));
			return;
		}
		const { syncStatus } = context.syncStatusHolder;
		if (syncConfig.syncConditionType == SyncConditionType.CUSTOM_TIME) {
			const items = await this.getByTimeLimit(syncConfig, context);
			syncStatus.totalNum(items.length);
			syncStatus.setNeedHandled(items.length);
			await this.handleItems(items, context);
			return;
		}

		const plans = await this.getPlans(syncConfig, context);
		const total = plans.reduce((sum, plan) => sum + Math.max(0, plan.to - plan.from + 1), 0);
		syncStatus.totalNum(total);
		syncStatus.setNeedHandled(total);
		const seen = new Set<string>();
		for (const plan of plans) {
			await this.visitPages(plan, async (items) => {
				const unique = items.filter((item) => {
					if (seen.has(item.id)) {
						syncStatus.totalNum(syncStatus.getTotal() - 1);
						return false;
					}
					seen.add(item.id);
					return true;
				});
				await this.handleItems(unique, context);
			});
		}
		syncStatus.setNeedHandled(syncStatus.getTotal() - syncStatus.getHasHandle());
	}

	// Apply the existing one-based, inclusive range independently to each status.
	// Keep the original ALL scope for the shared incremental cache key.
	private async getPlans(syncConfig: SyncConfig, context: HandleContext): Promise<SyncListPlan[]> {
		const plans: SyncListPlan[] = [];
		let allTotal = 0;
		const handlers = this.doubanListHandlers.filter((h) => h.support(syncConfig));
		for (const handler of handlers) {
			if (!context.plugin.statusHolder.syncing()) {
				break;
			}
			if (plans.length > 0) {
				await this.delay();
				if (!context.plugin.statusHolder.syncing()) {
					break;
				}
			}
			const from = syncConfig.syncConditionType == SyncConditionType.CUSTOM_ITEM
				? syncConfig.syncConditionCountFromValue : 1;
			const listContext = { ...context, syncOffset: Math.floor((from - 1) / PAGE_SIZE) * PAGE_SIZE };
			const firstPage = await handler.getPageData(listContext);
			if (!firstPage || !context.plugin.statusHolder.syncing()) {
				break;
			}
			allTotal += firstPage.total;
			if (handlers.length == 1 && from > firstPage.total) {
				context.syncStatusHolder.syncStatus.setMessage(i18nHelper.getMessage("130121", firstPage.total));
			}
			let to = firstPage.total;
			if (syncConfig.syncConditionType == SyncConditionType.CUSTOM_ITEM) {
				to = Math.min(syncConfig.syncConditionCountToValue || to, to);
			} else if (syncConfig.syncConditionType == SyncConditionType.LAST_THIRTY) {
				to = Math.min(PAGE_SIZE, to);
			}
			plans.push({ handler, context: listContext, firstPage, from, to });
		}
		context.syncStatusHolder.syncStatus.setAllTotal(allTotal);
		return plans;
	}

	private async visitPages(plan: SyncListPlan, visit: (items: SubjectListItem[]) => Promise<void>): Promise<void> {
		const { handler, context, from, to } = plan;
		let page = plan.firstPage;
		while (context.plugin.statusHolder.syncing() && context.syncOffset < to) {
			if (!page || !page.list || page.list.length == 0) {
				return;
			}
			const start = Math.max(0, from - 1 - context.syncOffset);
			const end = Math.min(page.list.length, to - context.syncOffset);
			await visit(page.list.slice(start, end).filter((item) => item != null));
			context.syncOffset += PAGE_SIZE;
			if (!context.plugin.statusHolder.syncing() || context.syncOffset >= to) {
				return;
			}
			await this.delay();
			if (!context.plugin.statusHolder.syncing()) {
				return;
			}
			const allTotal = context.syncStatusHolder.syncStatus.getAllTotal();
			page = await handler.getPageData(context);
			// List handlers publish their own totals; retain the combined total.
			context.syncStatusHolder.syncStatus.setAllTotal(allTotal);
		}
	}

	async getByTimeLimit(syncConfig: SyncConfig, context: HandleContext): Promise<SubjectListItem[]> {
		const startDate = syncConfig.syncConditionDateFromValue ? new Date(syncConfig.syncConditionDateFromValue) : null;
		const endDate = syncConfig.syncConditionDateToValue ? new Date(syncConfig.syncConditionDateToValue) : null;
		if (!startDate && !endDate) {
			log.warn(i18nHelper.getMessage("110081"));
			return [];
		}
		const plans = await this.getPlans(syncConfig, context);
		const allTotal = context.syncStatusHolder.syncStatus.getAllTotal();
		const selected = new Map<string, SubjectListItem>();
		// Traverse real offsets: dates and page boundaries are local to each list.
		for (const plan of plans) {
			await this.visitPages(plan, async (items) => {
				for (const item of items) {
					if (item.updateDate && (!startDate || item.updateDate >= startDate)
						&& (!endDate || item.updateDate <= endDate) && !selected.has(item.id)) {
						selected.set(item.id, item);
					}
				}
			});
		}
		context.syncStatusHolder.syncStatus.setAllTotal(allTotal);
		return Array.from(selected.values());
	}

	private async handleItems(items: SubjectListItem[], context: HandleContext): Promise<void> {
		const { syncStatus } = context.syncStatusHolder;
		const allTotal = syncStatus.getAllTotal();
		for (const item of items) {
			if (!context.plugin.statusHolder.syncing()) {
				return;
			}
			try {
				if (syncStatus.shouldSync(item.id)) {
					await this.doubanSubjectLoadHandler.handle(item.id, context);
					await this.delay();
				} else {
					syncStatus.unHandle(item.id, item.title);
				}
			} catch (e) {
				log.notice(i18nHelper.getMessage("130120"));
			}
			syncStatus.setNeedHandled(syncStatus.getTotal() - syncStatus.getHasHandle());
		}
		syncStatus.setAllTotal(allTotal);
	}

	private async delay(): Promise<void> {
		await sleepRange(BasicConst.CALL_DOUBAN_DELAY, BasicConst.CALL_DOUBAN_DELAY + BasicConst.CALL_DOUBAN_DELAY_RANGE);
	}
}
