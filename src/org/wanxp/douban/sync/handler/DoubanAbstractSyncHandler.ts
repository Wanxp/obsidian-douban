import DoubanPlugin from "../../../main";
import {
	BasicConst,
	PAGE_SIZE,
	SyncConditionType,
	SyncType,
} from "../../../constant/Constsant";
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
import { SearchPage } from "../../data/model/SearchPage";
import {SearchPageTypeOf} from "../../data/model/SearchPageTypeOf";

function toDateList(dataList: SubjectListItem[]): Date[] {
	const dateList = dataList
		.map((item) => item.updateDate)
		.sort((a, b) => {
			try {
				return a.getTime() - b.getTime();
			} catch (e) {
			}
			return 0;
		});
	return dateList;
}

function testTouchEndCondition(searchPage: SearchPage, context: HandleContext) {
	const { syncConfig } = context;
	if (!syncConfig) {
		return false;
	}
	switch (syncConfig.syncConditionType) {
		case SyncConditionType.ALL:
			return false;
		case SyncConditionType.LAST_THIRTY:
			return searchPage.pageNum >= 0;
		case SyncConditionType.CUSTOM_ITEM:
			const syncConditionCountToValue = syncConfig.syncConditionCountToValue? syncConfig.syncConditionCountToValue : searchPage.total;
			return searchPage.start + PAGE_SIZE - 1 >= syncConditionCountToValue;
		case SyncConditionType.CUSTOM_TIME:
			return true;
	}
	return false;
}

export abstract class DoubanAbstractSyncHandler<T extends DoubanSubject>
	implements DoubanSyncHandler
{
	private plugin: DoubanPlugin;
	private doubanSubjectLoadHandler: DoubanSubjectLoadHandler<T>;
	private doubanListHandlers: DoubanListHandler[];

	constructor(
		plugin: DoubanPlugin,
		doubanSubjectLoadHandler: DoubanSubjectLoadHandler<T>,
		doubanListHandlers: DoubanListHandler[],
	) {
		this.plugin = plugin;
		this.doubanSubjectLoadHandler = doubanSubjectLoadHandler;
		this.doubanListHandlers = doubanListHandlers;
	}

	support(t: string): boolean {
		return this.getSyncType() == t;
	}

	abstract getSyncType(): SyncType;

	async sync(syncConfig: SyncConfig, context: HandleContext): Promise<void> {
		if (syncConfig.syncConditionType == SyncConditionType.CUSTOM_TIME) {
			await this.syncByTimeLimit(syncConfig, context);
		} else if (syncConfig.syncConditionType == SyncConditionType.CUSTOM_ITEM) {
			await this.syncByCountLimit(syncConfig, context);
		}else if (syncConfig.syncConditionType == SyncConditionType.ALL) {
			await this.syncAll(syncConfig, context);
		}else if (syncConfig.syncConditionType == SyncConditionType.LAST_THIRTY) {
			await this.syncLastThirty(syncConfig, context);
		}else {
			log.warn(i18nHelper.getMessage("110083"));
		}
	}

	async getByTimeLimit(syncConfig: SyncConfig, context: HandleContext): Promise<SubjectListItem[]> {
		let startDate = syncConfig.syncConditionDateFromValue
			? new Date(syncConfig.syncConditionDateFromValue)
			: null;
		let endDate = syncConfig.syncConditionDateToValue
			? new Date(syncConfig.syncConditionDateToValue)
			: null;
		if (!startDate && !endDate) {
			log.warn(i18nHelper.getMessage("110081"));
			return;
		}
		const cacheList = new Map<number, SearchPageTypeOf<SubjectListItem>>();
		let searchPage = await this.getItems(syncConfig, context);
		if (!searchPage) {
			return;
		}
		const total = searchPage.total;
		const lastPage = total / PAGE_SIZE + 1;
		if (lastPage == 1) {
			return searchPage.list;
		}
		let leftPage = 1;
		let startPage = 1;
		let rightPage = lastPage;
		let endPage = lastPage;
		let currentPage = 1;
		cacheList.set(currentPage, searchPage);
		if (startDate != null) {
			do {
				if (!context.plugin.statusHolder.syncing()) {
					break;
				}
				let page = cacheList.get(currentPage);
				if (!page) {
					page = await this.getItems(syncConfig, context);
					if (!page) {
						break;
					}
					cacheList.set(currentPage, page);
				}
				const pageItems = page.list;
				const pageDateList = toDateList(pageItems);
				if (pageDateList[pageDateList.length - 1] >= startDate) {
					leftPage = currentPage;
					endPage = currentPage;
					currentPage = Math.ceil((leftPage + rightPage) / 2);
				}else {
					rightPage = currentPage;
					endPage = currentPage;
					currentPage = Math.floor((leftPage + rightPage) / 2);
				}
				if (currentPage == leftPage || currentPage == rightPage) {
					break;
				}
			} while (currentPage < lastPage);
		}
		leftPage = 1;
		rightPage = lastPage;
		currentPage = 1;
		if (endDate != null) {
			do {
				if (!context.plugin.statusHolder.syncing()) {
					break;
				}
				let page = cacheList.get(currentPage);
				if (!page) {
					page = await this.getItems(syncConfig, context);
					if (!page) {
						break;
					}
					cacheList.set(currentPage, page);
				}
				const pageItems = page.list;
				const pageDateList = toDateList(pageItems);
				if (pageDateList[0] <= endDate) {
					rightPage = currentPage;
					startPage = currentPage;
					currentPage = Math.ceil((leftPage + rightPage) / 2);
				}else {
					leftPage = currentPage;
					startPage = currentPage;
					currentPage = Math.floor((leftPage + rightPage) / 2);
				}
				if (currentPage == leftPage || currentPage == rightPage) {
					break;
				}
			} while (currentPage < lastPage);
		}
		let needHandleItems:SubjectListItem[] = [];
		for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
			if (!context.plugin.statusHolder.syncing()) {
				break;
			}
			let page = cacheList.get(pageNum);
			if (!page) {
				page = await this.getItems(syncConfig, context);
				if (!page) {
					break;
				}
				cacheList.set(pageNum, page);
			}
			const pageItems = page.list;
			needHandleItems = needHandleItems.concat(pageItems
				.filter((item) => {
					const itemDate = item.updateDate;
					return (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
				}
			));
		}
		return needHandleItems;

	}
	async syncByTimeLimit(syncConfig: SyncConfig, context: HandleContext) {
		const items = await this.getByTimeLimit(syncConfig, context);
		if (!items || items.length == 0) {
			return;
		}

		let subjectListItems = await this.removeExists(
			items,
			syncConfig,
			context,
		);

		const searchPage = new SearchPageTypeOf<SubjectListItem>(subjectListItems.length,
			1,
			subjectListItems.length,
			null,subjectListItems);
		await this.handleItems(searchPage, subjectListItems, context);

	}

	private async getItems(
		syncConfig: SyncConfig,
		context: HandleContext,
	): Promise<SearchPageTypeOf<SubjectListItem>> {
		const supportHandlers: DoubanListHandler[] =
			this.doubanListHandlers.filter((h) => h.support(syncConfig));
		const handler = supportHandlers[0];
		if (!context.plugin.statusHolder.syncing()) {
			return SearchPage.emptyWithNoType();
		}
		const item = await handler.getPageData(context);
		if (!context.plugin.statusHolder.syncing()) {
			return SearchPage.emptyWithNoType();
		}
		return item;
	}

	private async removeExists(
		items: SubjectListItem[],
		syncConfig: SyncConfig,
		context: HandleContext,
	): Promise<SubjectListItem[]> {
		if (!context.plugin.statusHolder.syncing()) {
			return [];
		}
		return items;
	}

	private async handleItems(
		searchPage: SearchPage,
		items: SubjectListItem[],
		context: HandleContext,
	): Promise<void> {
		if (!items || items.length == 0) {
			return;
		}
		const { syncStatus } = context.syncStatusHolder;
		syncStatus.totalNum(searchPage.total);
		const needHandled: number =
			syncStatus.getTotal() - syncStatus.getHasHandle();
		syncStatus.setNeedHandled(needHandled);
		for (const item of items) {
			if (!context.plugin.statusHolder.syncing()) {
				return;
			}
			try {
				if (syncStatus.shouldSync(item.id)) {
					let subject: DoubanSubject =
						await this.doubanSubjectLoadHandler.handle(
							item.id,
							context,
						);

					await sleepRange(
						BasicConst.CALL_DOUBAN_DELAY,
						BasicConst.CALL_DOUBAN_DELAY +
							BasicConst.CALL_DOUBAN_DELAY_RANGE,
					);
				} else {
					syncStatus.unHandle(item.id, item.title);
				}
			} catch (e) {
				log.notice(i18nHelper.getMessage("130120"));
			}
		}
	}

	private async syncByCountLimit(syncConfig: SyncConfig, context: HandleContext) {
		const {syncConditionCountFromValue, syncConditionCountToValue} = syncConfig;
		const startOffset = Math.floor((syncConditionCountFromValue - 1)/ PAGE_SIZE) * PAGE_SIZE;
		context.syncOffset = startOffset;
		//结束点是第几条
		let endOffsetNumberForCustom = 0;
		let needHandleTotalCustomItem = 0;
		let isFirstStep = true;
		let handleCount = 0;
		do {
			let searchPage = await this.getItems(syncConfig, context);
			if (!context.plugin.statusHolder.syncing()) {
				break;
			}
			const {list, total} = searchPage;
			if (
				!searchPage ||
				!list ||
				list.length == 0
			) {
				break;
			}
			if (syncConditionCountFromValue > total) {
				context.syncStatusHolder.syncStatus.setMessage(i18nHelper.getMessage("130121", total));
				break;
			}
			if (endOffsetNumberForCustom == 0) {
				endOffsetNumberForCustom = Math.min(syncConditionCountToValue?syncConditionCountToValue:searchPage.total, searchPage.total);
				needHandleTotalCustomItem = endOffsetNumberForCustom - syncConditionCountFromValue + 1;

			}
			let subjectListItems = [];

			//在开始和结束同一页
			if (Math.floor((syncConditionCountFromValue - 1) / PAGE_SIZE) == Math.floor((endOffsetNumberForCustom - 1) / PAGE_SIZE)) {
				const startIndex = Math.floor((syncConditionCountFromValue - 1) % PAGE_SIZE);
				const endIndex =  Math.floor((endOffsetNumberForCustom - 1) % PAGE_SIZE);
				subjectListItems = await this.removeExists(
					list.slice(startIndex, endIndex + 1),
					syncConfig,
					context,
				);
				handleCount += (endIndex - startIndex + 1);
			//第一页
			} else if (isFirstStep) {
				const startIndex = (syncConditionCountFromValue - 1) % PAGE_SIZE;
				handleCount += (list.length - startIndex);
				subjectListItems = await this.removeExists(
					list.slice(startIndex),
					syncConfig,
					context,
				);
				isFirstStep = false;
			}
			//最后一页
			else if (needHandleTotalCustomItem - handleCount <= PAGE_SIZE) {
				const endIndex = needHandleTotalCustomItem - handleCount;
				subjectListItems = await this.removeExists(
					list.slice(0, endIndex),
					syncConfig,
					context,
				);
				handleCount += endIndex;
				//中间页
			} else {
				subjectListItems = await this.removeExists(
					list,
					syncConfig,
					context,
				);
				handleCount += PAGE_SIZE;
			}


			if (!subjectListItems || subjectListItems.length == 0) {
				await sleepRange(
					BasicConst.CALL_DOUBAN_DELAY,
					BasicConst.CALL_DOUBAN_DELAY +
					BasicConst.CALL_DOUBAN_DELAY_RANGE,
				);
				continue;
			}

			searchPage.total = needHandleTotalCustomItem;
			//处理
			await this.handleItems(searchPage, subjectListItems, context);

			context.syncOffset = context.syncOffset + PAGE_SIZE;
			await sleepRange(
				BasicConst.CALL_DOUBAN_DELAY,
				BasicConst.CALL_DOUBAN_DELAY +
				BasicConst.CALL_DOUBAN_DELAY_RANGE,
			);
		} while (handleCount < needHandleTotalCustomItem);
	}

	private async syncAll(syncConfig: SyncConfig, context: HandleContext) {
		//最多100000条
		context.syncOffset = 0;
		let handleCount = 0;
		let totalForHandle = 0;
		let isFirstStep = true;
		do {
			let searchPage = await this.getItems(syncConfig, context);
			if (!context.plugin.statusHolder.syncing()) {
				break;
			}

			const {list, total} = searchPage;
			if (
				!searchPage ||
				!list ||
				list.length == 0
			) {
				break;
			}
			if (isFirstStep) {
				totalForHandle = total;
				isFirstStep = false;
			}
			handleCount += list.length;
			let subjectListItems = await this.removeExists(
				list,
				syncConfig,
				context,
			);
			if (!subjectListItems || subjectListItems.length == 0) {
				await sleepRange(
					BasicConst.CALL_DOUBAN_DELAY,
					BasicConst.CALL_DOUBAN_DELAY +
					BasicConst.CALL_DOUBAN_DELAY_RANGE,
				);
				continue;
			}
			await this.handleItems(searchPage, subjectListItems, context);
			context.syncOffset = context.syncOffset + PAGE_SIZE;
			await sleepRange(
				BasicConst.CALL_DOUBAN_DELAY,
				BasicConst.CALL_DOUBAN_DELAY +
				BasicConst.CALL_DOUBAN_DELAY_RANGE,
			);
		} while (handleCount <= totalForHandle);
	}

	private async syncLastThirty(syncConfig: SyncConfig, context: HandleContext) {
		context.syncOffset = 0;
		let searchPage = await this.getItems(syncConfig, context);
		if (!context.plugin.statusHolder.syncing()) {
			return;
		}
		const {list, total} = searchPage;
		if (
			!searchPage ||
			!list ||
			list.length == 0
		) {
			return;
		}

		let subjectListItems = await this.removeExists(
			list,
			syncConfig,
			context,
		);
		if (!subjectListItems || subjectListItems.length == 0) {
			return;
		}
		searchPage.total = Math.min(list.length, total);
		await this.handleItems(searchPage, subjectListItems, context);
	}
}
