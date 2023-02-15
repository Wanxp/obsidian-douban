export class SearchPageInfo {
	private _total: number;
	private _hasNext: boolean;
	private _pageSize: number;
	private _pageNum: number;

	constructor(total: number, pageNum: number, pageSize: number, hasNext: boolean) {
		this._total = total;
		this._pageNum = pageNum;
		this._pageSize = pageSize;
		this._hasNext = hasNext;
	}

	public nextPage(): SearchPageInfo {
		if (!this._hasNext) {
			return this;
		}
		if (((this._pageNum + 1) * this._pageSize) > this.total) {
			return this;
		}
		return new SearchPageInfo(this.total, this._pageNum + 1,
			this._pageSize, ((this._pageNum + 2) * this._pageSize) > this.total);
	}

	public previousPage(): SearchPageInfo {
		if (this._pageNum == 0) {
			return this;
		}
		return new SearchPageInfo(this.total, this._pageNum - 1,
			this._pageSize, true);
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
