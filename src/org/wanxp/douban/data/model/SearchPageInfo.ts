export class SearchPageInfo {
	private _total: number;
	private _pageSize: number;
	private _pageNum: number;
	
	private _hasNext: boolean;

	constructor(total: number, pageNum: number, pageSize: number) {
		this._total = total;
		this._pageNum = pageNum;
		this._pageSize = pageSize;
		this._hasNext = ((pageNum + 1) * pageSize) < total;
	}

	public nextPage(): SearchPageInfo {
		if (!this._hasNext) {
			return this;
		}
		return new SearchPageInfo(this.total, this._pageNum + 1,
			this._pageSize);
	}

	public previousPage(): SearchPageInfo {
		if (this._pageNum == 0) {
			return this;
		}
		return new SearchPageInfo(this.total, this._pageNum - 1,
			this._pageSize);
	}


	public get hasNext() {
		return this._hasNext;
	}

	public get hasPrevious() {
		return this._pageNum > 0;
	}


	public get start() {
		return this._pageNum * this._pageSize + 1;
	}

	public get total() {
		return this._total;
	}

	get pageSize(): number {
		return this._pageSize;
	}

	get pageNum(): number {
		return this._pageNum;
	}
}
