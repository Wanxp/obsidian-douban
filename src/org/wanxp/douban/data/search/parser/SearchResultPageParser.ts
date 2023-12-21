import {SearchResultPageParserInterface} from "./SearchResultPageParserInterface";
import {AllFirstPageSearchResultPageParser} from "./AllFirstPageSearchResultPageParser";
import {OtherAllPageSearchResultPageParser} from "./OtherAllPageSearchResultPageParser";
import {SearchPage} from "../../model/SearchPage";
import {SupportType} from "../../../../constant/Constsant";
import {NotAllPageSearchResultPageParser} from "./NotAllPageSearchResultPageParser";
import {NoteFirstPageSearchResultPageParser} from "./NoteFirstPageSearchResultPageParser";

export class SearchResultPageParser {

	private parsers:SearchResultPageParserInterface[] = [];

	constructor() {
		this.parsers.push(new AllFirstPageSearchResultPageParser());
		this.parsers.push(new OtherAllPageSearchResultPageParser());
		this.parsers.push(new NotAllPageSearchResultPageParser());
		this.parsers.push(new NoteFirstPageSearchResultPageParser());

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
