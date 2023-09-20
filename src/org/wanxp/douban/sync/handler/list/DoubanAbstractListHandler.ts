import { request, RequestUrlParam} from "obsidian";
import {i18nHelper} from 'src/org/wanxp/lang/helper';
import {log} from "src/org/wanxp/utils/Logutil";
import {CheerioAPI, load} from "cheerio";
import HandleContext from "../../../data/model/HandleContext";
import {doubanSubjectSyncListUrl} from "../../../../constant/Douban";
import {BasicConst, PAGE_SIZE} from "../../../../constant/Constsant";
import {SubjectListItem} from "../../../data/model/SubjectListItem";
import {DoubanListHandler} from "./DoubanListHandler";
import {SyncConfig} from "../../model/SyncConfig";
import  { sleepRange} from "../../../../utils/TimeUtil";
import {ALL} from "../../../../constant/DoubanUserState";
import HttpUtil from "../../../../utils/HttpUtil";

export default abstract class DoubanAbstractListHandler implements DoubanListHandler{

	async getAllPageList(context: HandleContext):Promise<SubjectListItem[]>{
		let all:SubjectListItem[] = [];
		let pages:SubjectListItem[] = [];
		let start = 0;
		do {
			await sleepRange(BasicConst.CALL_DOUBAN_DELAY,
				BasicConst.CALL_DOUBAN_DELAY + BasicConst.CALL_DOUBAN_DELAY_RANGE);
			const url:string = this.getUrl(context,  start);
			if (!context.plugin.statusHolder.syncing()) {
				return [];
			}
			pages = await this.getPageList(url, context);
			if (pages) {
				all = all.concat(pages);
			}
			start = start + PAGE_SIZE;
		} while (pages && pages.length > 0)
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
		return HttpUtil.httpRequestGet(url, headers, context.plugin.settingsManager)
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
				const titleValue:string = item.find('div.title > a').text().trim();
				let idPattern = /(\d){5,10}/g;
				let ececResult = idPattern.exec(linkValue);
				return ececResult?{id: ececResult[0], url: linkValue, title: titleValue}:null;
				// return linkValue;
			})
	}

	support(config: SyncConfig): boolean {
		return this.getDoType() == config.scope || ALL == config.scope;
	}
}

