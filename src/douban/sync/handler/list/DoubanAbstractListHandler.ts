import {moment, request, RequestUrlParam, TFile} from "obsidian";
import {i18nHelper} from 'src/lang/helper';
import {log} from "src/utils/Logutil";
import {CheerioAPI, load} from "cheerio";
import HandleContext from "@App/data/model/HandleContext";
import {doubanSubjectSyncListUrl} from "../../../../constant/Douban";
import {BasicConst, PAGE_SIZE} from "../../../../constant/Constsant";
import DoubanSearchResultSubject from "@App/data/model/DoubanSearchResultSubject";
import {SubjectListItem} from "@App/data/model/SubjectListItem";
import {DoubanListHandler} from "@App/sync/handler/list/DoubanListHandler";
import {SyncConfig} from "@App/sync/model/SyncConfig";
import TimeUtil from "../../../../utils/TimeUtil";

export default abstract class DoubanAbstractListHandler implements DoubanListHandler{

	async getAllPageList(context: HandleContext):Promise<SubjectListItem[]>{
		let all:SubjectListItem[] = [];
		let pages:SubjectListItem[] = [];
		let start = 0;
		do {
			const url:string = this.getUrl(context,  start);
			pages = await TimeUtil.delayRange(() => this.getPageList(url, context),
				BasicConst.CLEAN_STATUS_BAR_DELAY - BasicConst.CLEAN_STATUS_BAR_DELAY_RANGE,
				BasicConst.CLEAN_STATUS_BAR_DELAY - BasicConst.CLEAN_STATUS_BAR_DELAY_RANGE);
			if (pages) {
				all = all.concat(pages);
			}
			start = start + PAGE_SIZE;
		} while (pages)
		return all;
	}

	async delay(ms: number) {
	}

	private getUrl(context: HandleContext,  start:number) {
		return doubanSubjectSyncListUrl(this.getSyncType(), context.userComponent.getUserId(), this.getDoType(), start);
	}

	abstract getDoType():string;

	abstract getSyncType():string;

	async getPageList(url: string, context: HandleContext):Promise<SubjectListItem[]>  {
		let headers = JSON.parse(context.settings.searchHeaders);
		headers.Cookie = context.settings.loginCookiesContent;
		const requestUrlParam: RequestUrlParam = {
			url: url,
			method: "GET",
			headers: headers,
			throw: true
		};
		return request(requestUrlParam)
			.then(load)
			.then(data => this.parseSubjectFromHtml(data, context))
			.catch(e => log
				.error(
					i18nHelper.getMessage('130101')
						.replace('{0}',  e.toString())
					, e));
		;

	}





	parseSubjectFromHtml(dataHtml: CheerioAPI, context: HandleContext):SubjectListItem[] {
		 return dataHtml('.item-show')
			.get()
			.map((i: any) => {
				const item = dataHtml(i);
				const linkValue:string = item.find('div.title > a').attr('href');
				let idPattern = /(\d){5,10}/g;
				let ececResult = idPattern.exec(linkValue);
				return ececResult?{id: ececResult[0], url: linkValue}:null;
				// return linkValue;
			})
	}

	support(config: SyncConfig): boolean {
		return this.getDoType() == config.scope;
	}
}


