import {SupportType} from "../../../../constant/Constsant";
import {SearchResultPageParserInterface} from "./SearchResultPageParserInterface";
import {SearchPage} from "../../model/SearchPage";
import SearchParserHandlerV2 from "../SearchParserV2";
import StringUtil from "../../../../utils/StringUtil";
import {log} from "../../../../utils/Logutil";

export class AllFirstPageSearchResultPageParser implements SearchResultPageParserInterface {
	support(type:SupportType, pageNum:number):boolean {
		return pageNum == 1 && type == SupportType.ALL;
	}
	parse(source:string, type:SupportType, pageNum:number, pageSize:number):SearchPage {
		if (!source || StringUtil.notJsonString(source)) {
			//TODO 国际化
			log.notice("Obsidian-Douban:查询结果为空，无匹配结果，请尝试登录获取获取更多数据(已登录则忽略)");
			return SearchPage.empty(type);
		}

		const {subjects} = JSON.parse(source);
		if (!subjects) {
			return SearchPage.empty(type);
		}
		const {items} = subjects;
		if (!items ||items.length == 0) {
			return SearchPage.empty(type);
		}
		const doubanSearchResultSubjects = SearchParserHandlerV2.itemMapToSearchResult(items);
		return new SearchPage(2000, pageNum, pageSize, type, doubanSearchResultSubjects);
	}


}
