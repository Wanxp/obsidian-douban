
import DoubanSearchResultSubject from '../model/DoubanSearchResultSubject';
import SearchParserHandler from './SearchParser';
import {log} from 'src/org/wanxp/utils/Logutil';
import {request, requestUrl, RequestUrlParam} from "obsidian";
import {i18nHelper} from "../../../lang/helper";
import {load} from 'cheerio';
import {DoubanPluginSetting} from "../../setting/model/DoubanPluginSetting";
import {DEFAULT_SETTINGS} from "../../../constant/DefaultSettings";
import SettingsManager from "../../setting/SettingsManager";
import User from "../../user/User";
import {SearchPage} from "../model/SearchPage";

export default class Searcher {
	static search(searchItem: string, doubanSettings: DoubanPluginSetting, settingsManager:SettingsManager): Promise<DoubanSearchResultSubject[]> {
		const myHeaders:Record<string, string> = JSON.parse(doubanSettings.searchHeaders);
		if (doubanSettings.loginCookiesContent) {
			myHeaders.Cookie = doubanSettings.loginCookiesContent
		}
		let requestUrlParam: RequestUrlParam = {
			url: DEFAULT_SETTINGS.searchUrl + searchItem,
			method: "GET",
			headers: myHeaders,
			throw: true
		};
		return requestUrl(requestUrlParam)
			.then(requestUrlResponse => {
				if (requestUrlResponse.status == 403) {
					throw new Error(i18nHelper.getMessage('130106'));
				}
				return requestUrlResponse.text;
			})
			.then(load)
			.then(SearchParserHandler.parseSearch)
			.catch(e => {
				if(e.toString().indexOf('403') > 0) {
					throw new Error(i18nHelper.getMessage('130106'));
				}else {
					throw log.error(i18nHelper.getMessage('130101').replace('{0}', e.toString()), e);
				}
			});
			;

	};

	static loadSearchItem(searchItem: string, start:number, doubanSettings: DoubanPluginSetting, settingsManager:SettingsManager): Promise<SearchPage> {
		const myHeaders:Record<string, string> = JSON.parse(doubanSettings.searchHeaders);
		if (doubanSettings.loginCookiesContent) {
			myHeaders.Cookie = doubanSettings.loginCookiesContent
		}
		log.debug("请求更多页面");
		let requestUrlParam: RequestUrlParam = {
			url: `https://www.douban.com/j/search?q=${searchItem}&start=${start}&subtype=item`,
			method: "GET",
			headers: myHeaders,
			throw: true
		};
		return requestUrl(requestUrlParam)
			.then(requestUrlResponse => {
				if (requestUrlResponse.status == 403) {
					throw new Error(i18nHelper.getMessage('130106'));
				}
				return requestUrlResponse.text;
			})
			.then(e=>SearchParserHandler.parseSearchJson(e, start))
			.catch(e => {
				if(e.toString().indexOf('403') > 0) {
					throw new Error(i18nHelper.getMessage('130106'));
				}else {
					throw log.error(i18nHelper.getMessage('130101').replace('{0}', e.toString()), e);
				}
			});
		;

	};

}
