import {DataValueType} from "../../constant/Constsant";

export class DataField {
	private _name: string;
	private _type: DataValueType;
	private _origin: any;
	private _value: any;
	constructor(name: string, type: DataValueType, origin: any, value: any) {
		this._name = name;
		this._type = type;
		this._origin = origin;
		this._value = value;
	}

	public get name():string{
		return this._name;
	}

	public get type():DataValueType{
		return this._type;
	}

	public get origin():any{
		return this._origin;
	}

	public get value():any{
		return this._value;
	}


}
