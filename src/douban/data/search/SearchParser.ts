import { CheerioAPI } from "cheerio";
import DoubanSearchResultSubject from "../model/DoubanSearchResultSubject";

export default class SearchParserHandler {
    static parseSearch(dataHtml:CheerioAPI):DoubanSearchResultSubject[]  {
        return dataHtml('.result')
            .get()
            .map((i:any) => {
                const item = dataHtml(i);
                let idPattern = /(\d){5,10}/g;
                let urlPattern = /(https%3A%2F%2F)\S+(\d){5,10}/g;
                let linkValue = item.find("div.content > div > h3 > a").attr("href");
                let ececResult = idPattern.exec(linkValue);
                let urlResult = urlPattern.exec(linkValue);
                let cast = item.find(".subject-cast").text();
				let score = item.find(".rating_nums").text();
                const result:DoubanSearchResultSubject = {
					id: ececResult ? ececResult[0] : '',
					title: item.find("div.content > div > h3 > a").text(),
					score: score ? Number(score) : null,
					cast: cast,
					type: item.find("div.content > div > h3 > span").text(),
					desc: item.find("div.content > p").text(),
					url: urlResult ? decodeURIComponent(urlResult[0]) : 'https://www.douban.com',
					image: "",
					publisher: "",
					datePublished: undefined,
					genre: []
				};
                return result;
            })
    };
}