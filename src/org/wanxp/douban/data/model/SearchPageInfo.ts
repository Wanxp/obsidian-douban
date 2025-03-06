import {SupportType} from "../../../constant/Constsant";

export class SearchPageInfo {
	private _total: number;
	private _pageSize: number;
	private _pageNum: number;
	
	private _hasNext: boolean;
	private _type: SupportType;

	constructor(total: number, pageNum: number, pageSize: number, type: SupportType) {
		this._total = total;
		this._pageNum = pageNum;
		this._pageSize = pageSize;
		this._hasNext = (pageNum * pageSize) < total;
		this._type = type;
	}

	public nextPage(): SearchPageInfo {
		if (!this._hasNext) {
			return this;
		}
		return new SearchPageInfo(this.total, this._pageNum + 1,
			this._pageSize, this._type);
	}


	public previousPage(): SearchPageInfo {
		if (this._pageNum == 0) {
			return this;
		}
		return new SearchPageInfo(this.total, this._pageNum - 1,
			this._pageSize, this._type);
	}

	public typePage(type: SupportType): SearchPageInfo {
		return new SearchPageInfo(this.total, 0,
			this._pageSize, this._type);
	}


	public get hasNext() {
		return this._hasNext;
	}

	public get hasPrevious() {
		return this._pageNum > 1;
	}


	public get start() {
		return (this._pageNum - 1) * this._pageSize + 1;
	}

	public get total() {
		return this._total;
	}

	public set total(total: number) {
		this._total = total;
	}

	get pageSize(): number {
		return this._pageSize;
	}

	get pageNum(): number {
		return this._pageNum;
	}

	get type(): SupportType {
		return this._type;
	}

	allPage() {
		if (this._pageNum == 0) {
			return this;
		}
		return new SearchPageInfo(this.total, this._pageNum - 1,
			this._pageSize, SupportType.ALL);
	}


}
