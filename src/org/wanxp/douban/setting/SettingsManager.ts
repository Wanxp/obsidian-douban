import {App, Setting} from "obsidian";
import { DEFAULT_SETTINGS } from "src/org/wanxp/constant/DefaultSettings";
import DoubanPlugin from "../../main";
import Logger from "../../utils/Logutil";
import { DoubanPluginSetting } from "./model/DoubanPluginSetting";
import StringUtil from "../../utils/StringUtil";
import {DEFAULT_DOUBAN_HEADERS, ONLINE_SETTING_DEFAULT, SupportType} from "../../constant/Constsant";
import GithubUtil from "../../utils/GithubUtil";
import {DoubanPluginOnlineData} from "./model/DoubanPluginOnlineData";
import {DoubanPluginOnlineSettings} from "./model/DoubanPluginOnlineSettings";
import {DoubanPluginSubjectProperty} from "./model/DoubanPluginSubjectProperty";
import HandleContext from "../data/model/HandleContext";
import HtmlUtil from "../../utils/HtmlUtil";

export default class SettingsManager {
	app: App;
	plugin: DoubanPlugin;
	settings:  DoubanPluginSetting;
	cleanupFns: Array<() => void> = [];
	innerLogger: Logger = new Logger();
	cookieTemp:string;
	onlineSettings: DoubanPluginOnlineSettings;

	constructor(app: App, plugin: DoubanPlugin) {
		this.app = app;
		this.plugin = plugin;
		this.settings = plugin.settings;
	}



	getSettingWithDefault(key: keyof DoubanPluginSetting) {

		return [this.settings[key], DEFAULT_SETTINGS[key]];
	}

	getSetting(key: keyof DoubanPluginSetting) {

		return this.settings[key];
	}

	getHeaders():object {
		if (this.settings.loginHeadersContent) {
			// return StringUtil.parseHeaders(this.settings.loginHeadersContent);
			return JSON.parse(this.settings.loginHeadersContent);
		}else if (this.settings.loginCookiesContent) {
			return {Cookie: this.settings.loginCookiesContent, ...DEFAULT_DOUBAN_HEADERS};
		}else {
			return DEFAULT_DOUBAN_HEADERS;
		}
	}

	getHeadersByCookie(cookie:string):object {
		if (cookie) {
			return {...DEFAULT_DOUBAN_HEADERS, Cookie: cookie};
		}else {
			return DEFAULT_DOUBAN_HEADERS;
		}
	}




	async updateSetting(key: keyof DoubanPluginSetting, value:any) {
		// @ts-ignore
		this.settings[key] = value;
		await this.plugin.saveSettings();
	}

	debug(message:any):any {
		if(this.settings.debugMode) {
			return this.innerLogger.debug(message);
		}else {
			return message;
		}
	}

	updateCookieTemp(cookie:string):void {
		this.cookieTemp = cookie;
	}

	getCookieTemp():string {
		return this.cookieTemp;
	}

	getSelector(itemType: SupportType, propertyName: string):string[] {
		if (this.onlineSettings && this.onlineSettings.properties) {
			const doubanPluginSubjectProperty:DoubanPluginSubjectProperty = this.onlineSettings.properties.find(subjectProperty => subjectProperty.type === itemType && subjectProperty.name === propertyName);
			if(doubanPluginSubjectProperty) {
				return doubanPluginSubjectProperty.selectors;
			}
		}
		return ONLINE_SETTING_DEFAULT.properties.find(subjectProperty => subjectProperty.type === itemType && subjectProperty.name === propertyName).selectors;
	}

	handleArray(arr: string[]): string {
		let result:string =  StringUtil.handleArray(arr, this.settings);
		return HtmlUtil.strToHtml(result);
	}

}
