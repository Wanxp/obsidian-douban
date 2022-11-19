import en from './locale/en';
import zhCN from './locale/zh-cn';

const localeMap: { [k: string]: Partial<typeof en> } = {
	en,
	zh: zhCN,
};

const lang = window.localStorage.getItem('language');
const locale = localeMap[lang || 'en'];


export default class I18nHelper {
	public getMessage(str: keyof typeof en, ...params: any[]): string {
		if (!locale) {
			console.error('Error: obsidian douban locale not found', lang);
		}

		let val:string = (locale && locale[str]) || en[str];
		if (params) {
			for (let i:number = 0;i < params.length;i++) {
				val = val.replaceAll(`{${i}}`, params[i])
			}
		}
		return val;
	}
}

export const i18nHelper: I18nHelper = new I18nHelper();
