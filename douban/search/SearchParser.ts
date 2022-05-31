import { CheerioAPI } from "cheerio";
import { DoubanExtract } from "douban/Douban";
import { type } from "os";

interface DoubanSearchResultExtract extends DoubanExtract{
	cast: string;
	score: string;
}


class SearchParserHandler {
    static parseSearch(dataHtml:CheerioAPI):DoubanSearchResultExtract[]  {
        return dataHtml('.result')
            .get()
            .map((i:any) => {
                const item = dataHtml(i);
                var idPattern = /(\d){5,10}/g;
                var urlPattern = /(https%3A%2F%2F)\S+(\d){5,10}/g;
                var linkValue = item.find("div.content > div > h3 > a").text();
                var ececResult = idPattern.exec(linkValue);
                var urlResult = urlPattern.exec(linkValue);
                var cast = item.find(".subject-cast").text();
                const result:DoubanSearchResultExtract = {
                    id: ececResult?ececResult[0]:'',
                    title: item.find("div.content > div > h3 > a").text(),
                    score: item.find(".rating_nums").text(),
                    // duration: item.attr('data-duration'),
                    // region: item.attr('data-region'),
                    // director: item.attr('data-director'),
                    // actors: item.attr('data-actors'),
                    // poster: item.find('.poster img').attr('src'),
                    cast: cast,
                    type: item.find("div.content > div > h3 > span").text(),
                    desc: item.find("div.content > p").text(),
                    url: urlResult?decodeURIComponent(urlResult[0]):'https://www.douban.com',
                };
                return result;
            })
    };
}

export {SearchParserHandler}
export type {DoubanSearchResultExtract}