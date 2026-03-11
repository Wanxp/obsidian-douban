import {SupportType} from "../../../../constant/Constsant";
import {SearchResultPageParserInterface} from "./SearchResultPageParserInterface";
import {log} from "../../../../utils/Logutil";
import {SearchPage} from "../../model/SearchPage";
import SearchParserHandler from "../SearchParser";

export class OtherAllPageSearchResultPageParser implements SearchResultPageParserInterface {
	support(type:SupportType, pageNum:number):boolean {
		return pageNum > 1 && type == SupportType.all;
	}
	parse(source:string, type:SupportType, pageNum:number, pageSize:number):SearchPage {
		log.debug("解析给多页面结果");
		if (!source) {
			return new SearchPage(0, 0, 0, type, []);
		}
		return SearchParserHandler.parseSearchJson(source, type, pageNum);
	}

}
