import {SearchResultPageParserInterface} from "./SearchResultPageParserInterface";
import {FistAllPageSearchResultPageParser} from "./FistAllPageSearchResultPageParser";
import {OtherAllPageSearchResultPageParser} from "./OtherAllPageSearchResultPageParser";
import {SearchPage} from "../../model/SearchPage";
import {SupportType} from "../../../../constant/Constsant";

export class SearchResultPageParser {

	private parsers:SearchResultPageParserInterface[] = [];

	constructor() {
		this.parsers.push(new FistAllPageSearchResultPageParser());
		this.parsers.push(new OtherAllPageSearchResultPageParser());
	}

	public parse(source:string, type:SupportType, pageNum:number, pageSize:number):SearchPage {
		for (const parser of this.parsers) {
			if (parser.support(type, pageNum)) {
				return parser.parse(source, type, pageNum, pageSize);
			}
		}
		throw new Error(`not support type:${type} pageNum:${pageNum}`);
	}

}
