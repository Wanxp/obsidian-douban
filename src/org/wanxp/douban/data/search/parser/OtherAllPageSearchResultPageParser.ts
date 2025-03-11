import {SupportType} from "../../../../constant/Constsant";
import {SearchResultPageParserInterface} from "./SearchResultPageParserInterface";
import {log} from "../../../../utils/Logutil";
import {SearchPage} from "../../model/SearchPage";
import SearchParserHandlerV2 from "../SearchParserV2";

export class OtherAllPageSearchResultPageParser implements SearchResultPageParserInterface {
	support(type:SupportType, pageNum:number):boolean {
		return pageNum > 1 && type == SupportType.all;
	}
	parse(source:string, type:SupportType, pageNum:number, pageSize:number):SearchPage {
		log.debug("解析给多页面结果");
		const {contents} = JSON.parse(source);
		if (!contents) {
			return new SearchPage(0, 0, 0, type, []);
		}
		const data:{total:number, start:number, count:number, items:any[]} = contents;
		const doubanSearchResultSubjects = SearchParserHandlerV2.itemMapToSearchResult(data.items);
		return new SearchPage(data.total, pageNum, pageSize, type, doubanSearchResultSubjects);
	}

}
