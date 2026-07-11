import en from './locale/en';
import zhCN from './locale/zh-cn';

const localeMap: { [k: string]: Partial<typeof en> } = {
	en,
	zh: zhCN,
	'zh-cn': zhCN,
};

let currentLang = window.localStorage.getItem('language') || 'en';
let locale = localeMap[currentLang];

export default class I18nHelper {
	public getMessage(str: keyof typeof en | string, ...params: any[]): string {
		if (!locale) {
			console.error('Error: obsidian douban locale not found', currentLang);
		}
		// @ts-ignore
		let val: string = (locale && locale[str]) || en[str];
		if (params) {
			for (let i: number = 0; i < params.length; i++) {
				val = this.replaceAll(i, val, params[i])
			}
		}
		return val;
	}

	public setLanguage(lang: string): void {
		currentLang = lang;
		locale = localeMap[lang] || localeMap['en'];
		window.localStorage.setItem('language', lang);
	}

	public getLanguage(): string {
		return currentLang;
	}

	private replaceAll(index: number, message: string, replace: string): string {
		const placeholderRegex = new RegExp(`\\{${index}:([^}]+)\\}`);
		const match = message.match(placeholderRegex);
		if (!match) {
			return message.replaceAll(`{${index}}`, replace);
		}
		const defaultValue = match ? match[1] : '';

		const replacement = (replace === undefined || replace === null) ? defaultValue : replace;

		return message.replace(placeholderRegex, replacement);
	}
}

export const i18nHelper: I18nHelper = new I18nHelper();
