import { CheerioAPI } from "cheerio";
import DoubanSearchResultSubject from "douban/model/DoubanSearchResultSubject";

export default class SearchParserHandler {
    static parseSearch(dataHtml:CheerioAPI):DoubanSearchResultSubject[]  {
        return dataHtml('.result')
            .get()
            .map((i:any) => {
                const item = dataHtml(i);
                var idPattern = /(\d){5,10}/g;
                var urlPattern = /(https%3A%2F%2F)\S+(\d){5,10}/g;
                var linkValue = item.find("div.content > div > h3 > a").attr("href");
                var ececResult = idPattern.exec(linkValue);
                var urlResult = urlPattern.exec(linkValue);
                var cast = item.find(".subject-cast").text();
                const result:DoubanSearchResultSubject = {
                    id: ececResult?ececResult[0]:'',
                    title: item.find("div.content > div > h3 > a").text(),
                    score: item.find(".rating_nums").text(),
                    cast: cast,
                    type: item.find("div.content > div > h3 > span").text(),
                    desc: item.find("div.content > p").text(),
                    url: urlResult?decodeURIComponent(urlResult[0]):'https://www.douban.com',
                };
                return result;
            })
    };
}