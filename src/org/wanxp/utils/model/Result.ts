export class Result implements ResultI{

	private _success:boolean
	private _message:string
	private _result:any

	constructor(success:boolean, msg:string , data:any) {
	}

	get success():boolean {
		return this._success;
	}

	set success(value:boolean) {
		this._success = value;
	}

	set message(value:string) {
		this._message = value;
	}

	get message():string {
		return this._message;
	}

	set result (value:any) {
		this._result = value;
	}

	get result():any {
		return this._result;
	}


}


export interface ResultI {
	success:boolean
	message:string
	result:any
}
