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

}
