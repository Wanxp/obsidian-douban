import { SearchPageInfo } from "./SearchPageInfo";
import { SupportType } from "../../../constant/Constsant";
import {SearchPageTypeOf} from "./SearchPageTypeOf";

export class SearchPage extends SearchPageTypeOf<any> {

	public static empty(type: SupportType): SearchPage {
		return new SearchPage(0, 1, 0, type, []);
	}

	static emptyWithNoType() {
		return new SearchPage(0, 1, 0, null, []);
	}
}
