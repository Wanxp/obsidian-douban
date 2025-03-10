import { request, RequestUrlParam } from "obsidian";
import { i18nHelper } from "src/org/wanxp/lang/helper";
import { log } from "src/org/wanxp/utils/Logutil";
import { CheerioAPI, load } from "cheerio";
import HandleContext from "../../../data/model/HandleContext";
import { doubanSubjectSyncListUrl } from "../../../../constant/Douban";
import {
	BasicConst,
	PAGE_SIZE,
	SyncType,
	SyncTypeUrlDomain,
} from "../../../../constant/Constsant";
import { SubjectListItem } from "../../../data/model/SubjectListItem";
import { DoubanListHandler } from "./DoubanListHandler";
import { SyncConfig } from "../../model/SyncConfig";
import { sleepRange } from "../../../../utils/TimeUtil";
import { ALL } from "../../../../constant/DoubanUserState";
import HttpUtil from "../../../../utils/HttpUtil";
import { DoubanHttpUtil } from "../../../../utils/DoubanHttpUtil";
import { SearchPage } from "../../../data/model/SearchPage";
import {SearchPageTypeOf} from "../../../data/model/SearchPageTypeOf";

export default abstract class DoubanAbstractListHandler
	implements DoubanListHandler
{
	async getPageData(context: HandleContext): Promise<SearchPage> {
		let all: SubjectListItem[] = [];
		let pages: SearchPage = SearchPage.emptyWithNoType();

		const url: string = this.getUrl(context, context.syncOffset);
		if (!context.plugin.statusHolder.syncing()) {
			return SearchPage.emptyWithNoType();
		}
		let subjectListItemSearchPageTypeOf = await this.getPageList(url, context);
		if (subjectListItemSearchPageTypeOf) {
			context.plugin.statusHolder.syncStatus.setAllTotal(subjectListItemSearchPageTypeOf.total)
		}
		return subjectListItemSearchPageTypeOf;
	}

	async delay(ms: number) {}

	protected getUrl(context: HandleContext, start: number) {
		return doubanSubjectSyncListUrl(
			this.getSyncTypeDomain(),
			context.userComponent.getUserId(),
			this.getDoType(),
			start,
		);
	}

	abstract getDoType(): string;

	abstract getSyncType(): SyncType;

	getSyncTypeDomain(): string {
		return SyncTypeUrlDomain.get(this.getSyncType());
	}

	async getPageList(
		url: string,
		context: HandleContext,
	): Promise<SearchPageTypeOf<SubjectListItem>> {
		return DoubanHttpUtil.httpRequestGet(
			url,
			context.plugin.settingsManager.getHeaders(),
			context.plugin.settingsManager,
		)
			.then(load)
			.then((data) => this.parseSubjectFromHtml(data, context))
			.catch((e) =>
				log.error(
					i18nHelper
						.getMessage("130101")
						.replace("{0}", e.toString()),
					e,
				),
			);
	}

	parseSubjectFromHtml(
		dataHtml: CheerioAPI,
		context: HandleContext,
	): SearchPageTypeOf<SubjectListItem> {
		const items = dataHtml(".item-show")
			.get()
			.map((i: any) => {
				const item = dataHtml(i);
				const linkValue: string = item
					.find("div.title > a")
					.attr("href");
				const titleValue: string = item
					.find("div.title > a")
					.text()
					.trim();
				const updateDateStr: string = item.find("div.date").text().trim();
				let updateDate = null;
				try {
					updateDate = new Date(updateDateStr);
				}catch (e) {
					console.error(e);
					log.info("parse date error:" + titleValue);
				}
				let idPattern = /(\d){5,10}/g;
				let ececResult = idPattern.exec(linkValue);
				return !ececResult ? null : {id: ececResult[0], url: linkValue, title: titleValue, updateDate: updateDate};
				// return linkValue;
			});
		const subjectNumText = dataHtml(".subject-num").text().trim();
		const totalNumMatch = subjectNumText.match(/\/\s*(\d+)/);
		const totalNum = totalNumMatch ? parseInt(totalNumMatch[1], 10) : 0;
		return new SearchPage(
			totalNum,
			Math.floor(context.syncOffset / PAGE_SIZE) + 1,
			PAGE_SIZE,
			null,
			items,
		);
	}

	support(config: SyncConfig): boolean {
		return this.getDoType() == config.scope || ALL == config.scope;
	}
}
