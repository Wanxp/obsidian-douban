import { SearchPageInfo } from "./SearchPageInfo";
import { SupportType } from "../../../constant/Constsant";

export class SearchPageTypeOf<T> extends SearchPageInfo {
	private _list: T[];

	constructor(
		total: number,
		pageNum: number,
		pageSize: number,
		type: SupportType,
		list: T[],
	) {
		super(total, pageNum, pageSize, type);
		this._list = list;
	}

	public get list() {
		return this._list;
	}

	public static empty(type: SupportType): SearchPageTypeOf<any> {
		return new SearchPageTypeOf(0, 1, 0, type, []);
	}

	static emptyWithNoType() {
		return new SearchPageTypeOf(0, 1, 0, null, []);
	}
}
