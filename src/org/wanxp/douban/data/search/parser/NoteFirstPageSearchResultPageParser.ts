import {SupportType} from "../../../../constant/Constsant";
import {SearchResultPageParserInterface} from "./SearchResultPageParserInterface";
import {SearchPage} from "../../model/SearchPage";
import SearchParserHandlerV2 from "../SearchParserV2";
import {load} from "cheerio";
import DoubanSearchResultSubject from "../../model/DoubanSearchResultSubject";

export class NoteFirstPageSearchResultPageParser implements SearchResultPageParserInterface {
	support(type:SupportType, pageNum:number):boolean {
		return pageNum == 1 && type == SupportType.NOTE;
	}
	parse(source:string, type:SupportType, pageNum:number, pageSize:number):SearchPage {
		const pageData = load(source);
		if (!pageData) {
			return SearchPage.empty(type);
		}
		const doubanSearchResultSubjects = pageData(".result")
			.get()
			.map(( item)=> {
			const title = pageData(item).find("h3 a").text();
			const url = pageData(item).find("h3 a").attr("href");
			const id = url.match(/(\d){5,10}/g)[0]
			const author = pageData(item).find(".info").text();
			const content = pageData(item).find("p").text();
			const data: DoubanSearchResultSubject =
				 {
					id: id ??'',
					title: title ? title.replaceAll('\n', '').replaceAll(/\s+/g, '') : '-',
					score: null,
					cast: author? author.replaceAll('\n', '').replaceAll(/\s+/g, '') : '',
					type: '日记',
					desc: content ? content.replaceAll('\n', '').replaceAll(/\s+/g, '') : '-',
					url: url?? 'https://www.douban.com',
					image: "",
					imageUrl: "",
					publisher: "",
					datePublished: undefined,
					genre: []
				}
			return data;
		});
		return new SearchPage(2000, pageNum, pageSize, type, doubanSearchResultSubjects);
	}


}
