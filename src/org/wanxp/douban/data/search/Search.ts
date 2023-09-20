import {RequestUrlParam, request, requestUrl} from "obsidian";

import {DEFAULT_SETTINGS} from "../../../constant/DefaultSettings";
import {DoubanPluginSetting} from "../../setting/model/DoubanPluginSetting";
import DoubanSearchResultSubject from '../model/DoubanSearchResultSubject';
import {SearchPage} from "../model/SearchPage";
import SearchParserHandler from './SearchParser';
import SettingsManager from "../../setting/SettingsManager";
import User from "../../user/User";
import {i18nHelper} from "../../../lang/helper";
import {load} from 'cheerio';
import {log} from 'src/org/wanxp/utils/Logutil';
import HttpUtil from "../../../utils/HttpUtil";

export default class Searcher {
	static search(searchItem: string, doubanSettings: DoubanPluginSetting, settingsManager:SettingsManager): Promise<DoubanSearchResultSubject[]> {
		return HttpUtil.httpRequestGet(DEFAULT_SETTINGS.searchUrl + searchItem, settingsManager.getHeaders(), settingsManager)
			.then(load)
			.then(SearchParserHandler.parseSearch)
			.catch(e => {
				throw log.error(i18nHelper.getMessage('130101').replace('{0}', e.toString()), e);
			});

	};

	static loadSearchItem(searchItem: string, start:number, doubanSettings: DoubanPluginSetting, settingsManager:SettingsManager): Promise<SearchPage> {
		const url:string = `https://www.douban.com/j/search?q=${searchItem}&start=${start}&subtype=item`;
		log.debug(`请求更多页面:${url}`);
			return HttpUtil.httpRequestGet(url, settingsManager.getHeaders(), settingsManager)
			.then(e=>SearchParserHandler.parseSearchJson(e, start))
			.catch(e => {
				throw log.error(i18nHelper.getMessage('130101').replace('{0}', e.toString()), e);
			});
		;

	};

}
