import {CheerioAPI, load} from "cheerio";
import DoubanSearchResultSubject from "../model/DoubanSearchResultSubject";
import {SearchPage} from "../model/SearchPage";
import {SEARCH_ITEM_PAGE_SIZE, SupportType} from "../../../constant/Constsant";
import {log} from "../../../utils/Logutil";

export default class SearchParserHandler {
	static parseSearch(dataHtml: CheerioAPI): DoubanSearchResultSubject[] {
		return dataHtml('.result')
			.get()
			.map((i: any) => {
				const item = dataHtml(i);
				let idPattern = /(\d){5,10}/g;
				let urlPattern = /(https%3A%2F%2F)\S+(\d){5,10}(%2F)/g;
				let linkValue = item.find("div.content > div > h3 > a").attr("href");
				let ececResult = idPattern.exec(linkValue);
				let urlResult = urlPattern.exec(linkValue);
				let cast = item.find(".subject-cast").text();
				let score = item.find(".rating_nums").text();
				let title = item.find("div.content > div > h3 > a").text();
				let type = item.find("div.content > div > h3 > span").text();
				let desc = item.find("div.content > p").text();
				const result: DoubanSearchResultSubject = {
					id: ececResult ? ececResult[0] : '',
					title: title ? title : '-',
					score: score ? Number(score) : null,
					cast: cast,
					type: type ? type : '-',
					desc: desc ? desc : '-',
					url: urlResult ? decodeURIComponent(urlResult[0]) : 'https://www.douban.com',
					image: "",
					imageUrl: "",
					publisher: "",
					datePublished: undefined,
					genre: []
				};
				return result;
			})
	};

	static parseSearchJson(result: string, type:SupportType, start:number): SearchPage {
		log.debug("解析给多页面结果");
		const data:{total:number, limit:number, more:boolean, items:string[]} = JSON.parse(result);
		const list:string[] = data.items;
		const resultList:DoubanSearchResultSubject[] = list
			.map(e => load(e))
			.map(e=>this.parseSearch(e))
			.map(e => e? e[0]:null);
			return new SearchPage(data.total, start / data.limit, data.limit, type, resultList);
		};

}
