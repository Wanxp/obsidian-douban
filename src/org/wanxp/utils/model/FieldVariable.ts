export class FieldVariable {
	private _key:string;
	private _variable:string;
	private _outTypeName:string;

	constructor(key:string, variable:string, outTypeName:string) {
		this._key = key;
		this._variable = variable;
		this._outTypeName = outTypeName;
	}

	public get key():string{
		return this._key;
	}

	public get variable():string{
		return this._variable;
	}

	public get outTypeName():string{
		return this._outTypeName;
	}


}
