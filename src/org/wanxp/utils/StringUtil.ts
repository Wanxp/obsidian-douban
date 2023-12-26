import {DoubanPluginSetting} from "../douban/setting/model/DoubanPluginSetting";
import {ArraySetting} from "../douban/setting/model/ArraySetting";

export default class StringUtil {

	/**
	 * 字符串是不是空白
	 * @param str
	 */
	public static isBlank(str: string): boolean {
		return str == null || str.trim().length == 0;
	}

	/**
	 * 字符串若为空则返回默认值
	 */
	public static defaultIfBlank(str: string, defaultStr: string): string {
		return StringUtil.isBlank(str) ? defaultStr : str;
	}


	public static  analyzeIdByUrl(url: string):string {
		let idPattern = /(\d){5,10}/g;
		let idE = idPattern.exec(url);
		let id = idE ? idE[0] : '';
		return id;
	}



	/**
	 * request headers 字符串 转 json
	 * @param text
	 * @return json object
	 */
	public static parseHeaders(text: string): any {
		let headers = {};
		if (text) {
			//如果首行包含'GET'或者'POST'，则去掉首行
			if (text.indexOf('GET') == 0 || text.indexOf('POST') == 0) {
				text = text.substring(text.indexOf('\n') + 1);
			}
			let lines = text.split('\n');
			for (let line of lines) {
				let index = line.indexOf(':');
				if (index > 0) {
					let key = line.substring(0, index);
					let value = line.substring(index + 1).trim();
					// @ts-ignore
					headers[key] = value;
				}
			}
		}
		return headers;
	}


	public static confuse(text: string):string {
		if (!text) {
			return
		}
		let texts = Array.from(text);
		const length = texts.length;
		const newTexts = [];
		for (let i = 0; i < length; i++) {
			let val = text[i];
			if (i >= length/3 && i <= length * 2/3) {
				val = '*'
			}
			newTexts[i] = val;
		}
		return newTexts.join('');
	}

	/**
	 * 转义字符串 替换为 实际转义
	 */
	public static escape(text: string): string {
		if (!text) {
			return text;
		}
		let newText = text;
		EscapeMap.forEach((value, key) => {
			newText = newText.replace(key, value);
		});
		return newText;
	}

	public static  handleArray(arr: string[], arraySetting: ArraySetting): string {
		let content :string = "";
		const elementStart:string = StringUtil.escape(arraySetting.arrayElementStart);
		const elementEnd:string = StringUtil.escape(arraySetting.arrayElementEnd);
		const spilt:string = StringUtil.escape(arraySetting.arraySpiltV2);
		const start:string = StringUtil.escape(arraySetting.arrayStart);
		const end:string = StringUtil.escape(arraySetting.arrayEnd);
		for (let i = 0; i < arr.length; i++) {
			let el = arr[i];
			if (!el) {
				continue;
			}
			if (i == arr.length - 1) {
				content += elementStart + el + elementEnd
			} else {
				content +=  elementStart + el + elementEnd + spilt;
			}
		}
		content = start + content + end;
		return content;
	}


}

export const EscapeMap:Map< { [Symbol.replace](string: string, replaceValue: string): string; }, string> = new Map([
	[/\\n/g, "\n"],
	[/\\t/g, "\t"],
	[/\\r/g, "\r"],
	[/\\f/g, "\f"],
	[/\\b/g, "\b"],
	[/\\'/g, "'"],
	[/\\"/g, '"'],
	[/\\\\/g, "\\"],
])
