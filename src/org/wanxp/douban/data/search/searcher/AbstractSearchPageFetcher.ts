import { SupportType } from "src/org/wanxp/constant/Constsant";
import SettingsManager from "../../../setting/SettingsManager";
import {SearchPageFetcherInterface} from "./SearchPageFetcherInterface";
import HttpUtil from "../../../../utils/HttpUtil";
import {log} from "../../../../utils/Logutil";
import {i18nHelper} from "../../../../lang/helper";
import {DoubanHttpUtil} from "../../../../utils/DoubanHttpUtil";
import {Platform} from "obsidian";

export abstract class AbstractSearchPageFetcher implements SearchPageFetcherInterface {

	protected settingsManager: SettingsManager;

	constructor(settingsManager: SettingsManager) {
		this.settingsManager = settingsManager;
	}

	support(type: SupportType, pageNum?:number): boolean {
        throw new Error("Method not implemented.");
    }
    fetch(keyword: string, pageNum: number, pageSize: number): Promise<string> {
		const start:number = (pageNum - 1) * pageSize;
		const url:string = this.getSearchUrl(keyword, start, pageSize);
		if (!url) {
			return Promise.resolve("");
		}
		return DoubanHttpUtil.httpRequestGet(url, this.settingsManager.getHeaders(), this.settingsManager)
			.catch(e => {
				throw log.error(i18nHelper.getMessage('130101').replace('{0}', e.toString()), e);
			});    }

	getSearchUrl(keyword: string, start: number, pageSize: number):string {
		keyword = keyword.trim();
		if (keyword.length == 0) {
			return "";
		}
		keyword = HttpUtil.encodeUrl(keyword);
		return this.getUrl(keyword, start, pageSize)
	}

	abstract getUrl(keyword: string, start: number, pageSize: number):string;


}
