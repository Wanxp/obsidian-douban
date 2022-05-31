import cheerio from 'cheerio';
import { DoubanExtract, doubanHeadrs } from 'douban/Douban';
import { get, readStream } from 'tiny-network';
import { ensureStatusCode } from 'douban/ResponseHandle';


interface DoubanMovieExtract extends DoubanExtract {
    
}

export const playing = (city:string) => {
  return Promise
    .resolve()
    .then(() => get(`https://movie.douban.com/cinema/nowplaying/${city}/`))
    .then(ensureStatusCode(200))
    .then(readStream)
    .then(cheerio.load)
    .then(parsePlaying)
};


export const parsePlaying = (dataHtml:any) => {
  return dataHtml('.list-item')
      .get()
      .map((i:any) => {
      const item = dataHtml(i);
      console.log("version 5");
      const result = {
          id: item.attr('id'),
          title: item.attr('data-title'),
          score: item.attr('data-score'),
          duration: item.attr('data-duration'),
          region: item.attr('data-region'),
          director: item.attr('data-director'),
          actors: item.attr('data-actors'),
          poster: item.find('.poster img').attr('src'),
          link: `https://movie.douban.com/subject/${item.attr('id')}`,
      };
      // console.log("content is " + JSON.stringify(result));

      return result;
      })
  };











