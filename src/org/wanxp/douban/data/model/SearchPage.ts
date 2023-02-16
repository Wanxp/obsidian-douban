import {SearchPageInfo} from "./SearchPageInfo";

export class SearchPage extends SearchPageInfo{

	private _list:any[];


	constructor(total: number, pageNum: number, pageSize: number, list: any[]) {
		super(total, pageNum, pageSize);
		this._list = list;
	}

	public get list() {
		return this._list;
	}
}
