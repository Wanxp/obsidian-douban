import {Platform} from "obsidian";

export class HttpResponse {
	private readonly _status:number;
	private readonly _headers:Record<string, string>;
	private readonly _text:string | ArrayBuffer;

	constructor(status:number, headers:Record<string, string>, text:string | ArrayBuffer) {
		this._status = status;
		this._headers = headers;
		this._text = text;
	}

	get status():number {
		return this._status;
	}

	get headers():Record<string, string> {
		return this._headers;
	}

	get text():string | ArrayBuffer {
		return this._text;
	}

	get textString():string {
		if (this.text instanceof ArrayBuffer) {
			return new TextDecoder().decode(this.text as ArrayBuffer);
		}
		if (typeof this.text === 'string') {
			return this.text as string;
		}
		return '';
	}

	get textArrayBuffer():ArrayBuffer {
		if (Platform.isDesktopApp) {
			if (this.text instanceof Buffer) {
				return this.text as Buffer;
			}
		}
		if (this.text instanceof ArrayBuffer) {
			return this.text as ArrayBuffer;
		}
		if (typeof this.text === 'string') {
			return new TextEncoder().encode(this.text as string);
		}
		return new ArrayBuffer(0);
	}


	get textBlob():Blob {
		return new Blob([this.textArrayBuffer]);
	}

	get textJson():Record<string, any> {
		return JSON.parse(this.textString);
	}

}
