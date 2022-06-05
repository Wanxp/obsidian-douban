import { DoubanPluginSettings, doubanHeadrs } from 'douban/Douban';
import { get, readStream } from 'tiny-network';

import DoubanSearchResultSubject from 'douban/model/DoubanSearchResultSubject';
import SearchParserHandler from './SearchParser';
import cheerio from 'cheerio';
import { ensureStatusCode } from 'douban/ResponseHandle';
import { log } from 'utils/Logutil';

export default class Searcher {
  static search(searchItem:string, doubanSettings:DoubanPluginSettings):Promise<DoubanSearchResultSubject[]> {
    // getData();
    // getData2();
    // return Promise.resolve();
      return Promise
        .resolve()
        .then(() => get(doubanSettings.searchUrl + searchItem, JSON.parse(doubanSettings.searchHeaders)))
        .then(ensureStatusCode(200))
        .then(readStream)
        .then(cheerio.load)
        .then(SearchParserHandler.parseSearch)
        .then(log.trace);
  };
}
