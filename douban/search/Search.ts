import cheerio from 'cheerio';
import { doubanHeadrs, DoubanPluginSettings } from 'douban/Douban';
import { get, readStream } from 'tiny-network';
import { ensureStatusCode } from 'douban/ResponseHandle';
import { DoubanSearchResultExtract, SearchParserHandler } from './SearchParser';
import { log } from 'utils/logutil';

class Searcher {
  static search(searchItem:string, doubanSettings:DoubanPluginSettings):Promise<DoubanSearchResultExtract[]> {
    // getData();
    // getData2();
    // return Promise.resolve();
      return Promise
        .resolve()
        .then(() => get(doubanSettings.searchUrl + searchItem, JSON.parse(doubanSettings.searchHeaders)))
        .then(ensureStatusCode(200))
        .then(readStream)
        .then(log.info)
        .then(cheerio.load)
        .then(SearchParserHandler.parseSearch);
  };
}

export {Searcher}
