import DoubanAbstractListHandler from "./DoubanAbstractListHandler";
import {PAGE_SIZE, SubjectHandledStatus, SyncType} from "../../../../constant/Constsant";
import {CheerioAPI} from "cheerio";
import HandleContext from "../../../data/model/HandleContext";
import {SearchPageTypeOf} from "../../../data/model/SearchPageTypeOf";
import {SubjectListItem} from "../../../data/model/SubjectListItem";
import {log} from "../../../../utils/Logutil";
import {SearchPage} from "../../../data/model/SearchPage";
import {doubanGameSubjectSyncListUrl, doubanSubjectSyncListUrl} from "../../../../constant/Douban";
import {ALL, DoubanSubjectState} from "../../../../constant/DoubanUserState";

export abstract class DoubanGameListHandler extends DoubanAbstractListHandler {
	getSyncType(): SyncType {
		return SyncType.game;
	}

	abstract getDoType(): string;

	protected getUrl(context: HandleContext, start: number) {
		return doubanGameSubjectSyncListUrl(
			this.getSyncTypeDomain(),
			context.userComponent.getUserId(),
			this.getDoType(),
			start,
		);
	}

	parseSubjectFromHtml(
		dataHtml: CheerioAPI,
		context: HandleContext,
	): SearchPageTypeOf<SubjectListItem> {
		const items = dataHtml(".common-item")
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
		const total = this.getTotal(dataHtml, context);
		return new SearchPage(
			total,
			Math.floor(context.syncOffset / PAGE_SIZE) + 1,
			PAGE_SIZE,
			null,
			items,
		);
	}

	private getTotal(dataHtml: CheerioAPI,
									 context: HandleContext):number {
		const countDescs = dataHtml("div.tabs > a")
			.get()
			.map((i: any) => {
				const item = dataHtml(i);
				return item.text().trim();
			});
		const {syncConfig} = context;
		const {scope} = syncConfig;
		const pattern = /(\d+)/g;

		const wishCount = this.getCount(countDescs, '想玩', pattern);
		const collectCount = this.getCount(countDescs, '玩过', pattern);
		const doCount = this.getCount(countDescs, '在玩', pattern);


		switch (scope) {
			case DoubanSubjectState.wish:
				return wishCount;
			case DoubanSubjectState.collect:
				return collectCount;
			case DoubanSubjectState.do:
				return doCount;
			case ALL:
				return wishCount + collectCount + doCount;
		}


	}

	private getCount(countDescs:string[], keyword:string, pattern:RegExp):number {
		return countDescs.filter(desc => desc.includes(keyword)).map(desc => {
			const result = pattern.exec(desc);
			return result ? parseInt(result[0], 10) : 0;
		})[0];
	}
}


