import {SearchPageInfo} from "./SearchPageInfo";
import {SupportType} from "../../../constant/Constsant";

export class SearchPage extends SearchPageInfo{

	private _list:any[];


	constructor(total: number, pageNum: number, pageSize: number, type:SupportType, list: any[]) {
		super(total, pageNum, pageSize, type);
		this._list = list;
	}

	public get list() {
		return this._list;
	}

	public static empty(type:SupportType):SearchPage {
		return new SearchPage(0, 0, 0, type, []);
	}
}
