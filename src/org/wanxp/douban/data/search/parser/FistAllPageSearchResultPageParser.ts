import {SupportType} from "../../../../constant/Constsant";
import {SearchResultPageParserInterface} from "./SearchResultPageParserInterface";
import {SearchPage} from "../../model/SearchPage";
import SearchParserHandlerV2 from "../SearchParserV2";

export class FistAllPageSearchResultPageParser implements SearchResultPageParserInterface {
	support(type:SupportType, pageNum:number):boolean {
		return pageNum == 1 && type == SupportType.ALL;
	}
	parse(source:string, type:SupportType, pageNum:number, pageSize:number):SearchPage {
		const {subjects} = JSON.parse(source);
		if (!subjects) {
			return SearchPage.empty(type);
		}
		const {items} = subjects;
		if (!items ||items.length == 0) {
			return SearchPage.empty(type);
		}
		const doubanSearchResultSubjects = SearchParserHandlerV2.itemMapToSearchResult(items);
		return new SearchPage(items.length, pageNum, pageSize, type, doubanSearchResultSubjects);
	}


}
