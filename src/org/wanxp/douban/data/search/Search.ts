
import DoubanSearchResultSubject from '../model/DoubanSearchResultSubject';
import SearchParserHandler from './SearchParser';
import {log} from 'src/org/wanxp/utils/Logutil';
import {request, RequestUrlParam} from "obsidian";
import {i18nHelper} from "../../../lang/helper";
import {load} from 'cheerio';
import {DoubanPluginSetting} from "../../setting/model/DoubanPluginSetting";
import {DEFAULT_SETTINGS} from "../../../constant/DefaultSettings";

export default class Searcher {
	static search(searchItem: string, doubanSettings: DoubanPluginSetting): Promise<DoubanSearchResultSubject[]> {
		let requestUrlParam: RequestUrlParam = {
			url: DEFAULT_SETTINGS.searchUrl + searchItem,
			method: "GET",
			headers: JSON.parse(doubanSettings.searchHeaders),
			throw: true
		};
		return request(requestUrlParam)
			.then(load)
			.then(SearchParserHandler.parseSearch)
			.catch(e => log.error(i18nHelper.getMessage('130101').replace('{0}',   e.toString()), e));
			;

	};
}