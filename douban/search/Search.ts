import cheerio from 'cheerio';
import { doubanHeadrs, DoubanPluginSettings } from 'douban/Douban';
import { get, readStream } from 'tiny-network';
import { ensureStatusCode } from 'douban/ResponseHandle';
import { log } from 'utils/logutil';
import DoubanSearchResultSubject from 'douban/model/DoubanSearchResultSubject';
import SearchParserHandler from './SearchParser';

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
        .then(SearchParserHandler.parseSearch);
  };
}
