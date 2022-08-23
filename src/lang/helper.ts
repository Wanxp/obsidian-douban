import en from './locale/en';
import zhCN from './locale/zh-cn';

const localeMap: { [k: string]: Partial<typeof en> } = {
    en,
    zh: zhCN,
};

const lang = window.localStorage.getItem('language');
const locale = localeMap[lang || 'en'];


export default class I18nHelper {
    public getMessage(str: keyof typeof en): string {
        if (!locale) {
            console.error('Error: obsidian douban locale not found', lang);
          }
        
          return (locale && locale[str]) || en[str];
    }
}

export const i18nHelper:I18nHelper = new I18nHelper();