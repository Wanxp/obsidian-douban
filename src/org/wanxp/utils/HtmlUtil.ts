import {CheerioAPI} from "cheerio";

export default class HtmlUtil {

	/**
	 * 获取html text内容
	 * @param html
	 * @param selector
	 */
	public static getHtmlText(html: CheerioAPI, selector: string | string[]): string {
		if (!selector) {
			return null;
		}
		if (typeof selector == 'string') {
			return html(selector).text().trim();
		}else {
			let s = '', text = '';
			for (s of selector)  {
				text = this.getHtmlText(html, s);
				if (text) {
					return text;
				}
			}
		}
	}

	public static strToHtml(str: string): string {
		let result = str.replace(/\n/g, '<br/>');
		result.replace(/\s/g, '&nbsp;');
		return result;
	}




}
