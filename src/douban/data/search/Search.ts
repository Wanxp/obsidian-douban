import { DoubanPluginSettings, doubanHeadrs } from 'src/douban/Douban';

import DoubanSearchResultSubject from '../model/DoubanSearchResultSubject';
import SearchParserHandler from './SearchParser';
import { log } from 'src/utils/Logutil';
import {request, RequestUrlParam} from "obsidian";
import {i18nHelper} from "../../../lang/helper";
import { load } from 'cheerio';

export default class Searcher {
  static search(searchItem:string, doubanSettings:DoubanPluginSettings):Promise<DoubanSearchResultSubject[]> {
	  let requestUrlParam:RequestUrlParam = {
		  url: doubanSettings.searchUrl + searchItem,
		  method: "GET",
		  headers:  JSON.parse(doubanSettings.searchHeaders),
		  throw: true
	  };
	  return request(requestUrlParam)
		  .then(a => {log.trace(a.toString()); return a;})
		  .then(load)
		  .then(SearchParserHandler.parseSearch)
		  .catch(e => log.error(i18nHelper.getMessage('130101')))
	  ;

  };
}
