import {SearchPage} from "../../model/SearchPage";
import {SupportType} from "../../../../constant/Constsant";
import DoubanSearchResultSubject from "../../model/DoubanSearchResultSubject";

export interface SearchResultPageParserInterface {
	support(type:SupportType, pageNum:number):boolean;

	parse(source:string, type:SupportType, pageNum:number, pageSize:number):SearchPage;
}
