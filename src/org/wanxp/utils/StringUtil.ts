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
}
