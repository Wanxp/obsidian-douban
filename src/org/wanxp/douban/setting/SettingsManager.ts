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
import {
	ARRAY_NAME_PREFIX_NAME,
	ArraySetting,
	ArraySettingFieldName,
	DEFAULT_SETTINGS_ARRAY_NAME
} from "./model/ArraySetting";

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
		const doubanPluginSubjectProperty = ONLINE_SETTING_DEFAULT.properties.find(subjectProperty => subjectProperty.type === itemType && subjectProperty.name === propertyName);
		if(doubanPluginSubjectProperty) {
			return doubanPluginSubjectProperty.selectors;
		}
		return [];
	}

	handleArray(arr: string[], arraySetting:ArraySetting): string {
		let result:string =  StringUtil.handleArray(arr, arraySetting);
		return HtmlUtil.strToHtml(result);
	}

	async updateArraySetting(arraySetting: ArraySetting) {
		if (arraySetting.arrayName == DEFAULT_SETTINGS_ARRAY_NAME) {
			this.settings.arrayStart = arraySetting.arrayStart;
			this.settings.arrayElementStart = arraySetting.arrayElementStart;
			this.settings.arraySpiltV2 = arraySetting.arraySpiltV2;
			this.settings.arrayElementEnd = arraySetting.arrayElementEnd;
			this.settings.arrayEnd = arraySetting.arrayEnd;
		}else {
			const index = this.settings.arraySettings.findIndex(as => as.arrayName == arraySetting.arrayName);
			if (index == -1) {
				this.settings.arraySettings.push(arraySetting);
			} else {
				this.settings.arraySettings[index] = arraySetting;
			}
		}
		await this.plugin.saveSettings();
	}

	async removeArraySetting(arrayName: string) {
		if (arrayName == DEFAULT_SETTINGS_ARRAY_NAME) {
			return;
		}else {
			this.settings.arraySettings = this.settings.arraySettings.filter(arraySetting => arraySetting.arrayName !== arrayName);
		}
		await this.plugin.saveSettings();
	}

	getArraySetting(arrayName: string) {
		if (!this.settings.arraySettings) {
			this.settings.arraySettings = [];
		}
		if (arrayName == DEFAULT_SETTINGS_ARRAY_NAME) {
			return this.getDefaultArraySetting(DEFAULT_SETTINGS_ARRAY_NAME, 0);
		}else {
			const arraySetting = this.settings.arraySettings.find(arraySetting => arraySetting.arrayName == arrayName);
			if (arraySetting) {
				return arraySetting;
			}
		}
		return null;
	}

	getDefaultArraySetting(arrayName:string, index:number): ArraySetting {
		return {arrayName: arrayName,
			arrayStart: this.settings.arrayStart,
			arrayElementStart: this.settings.arrayElementStart,
			arraySpiltV2: this.settings.arraySpiltV2,
			arrayElementEnd: this.settings.arrayElementEnd,
			arrayEnd: this.settings.arrayEnd,
			index: index
		};
	}

	async addArraySetting() {
		const index = this.settings.arraySettings.length + 1;
		const arraySetting = this.getDefaultArraySetting(ARRAY_NAME_PREFIX_NAME  + index, index);
		this.settings.arraySettings.push(arraySetting);
		await this.plugin.saveSettings();
		return arraySetting;
	}

	getSettingStr(field: keyof DoubanPluginSetting): string {
		const setting = this.getSetting(field);
		if (setting) {
			if (typeof setting == 'string') {
				return setting;
			}else {
				return setting.toString();
			}
		}
		return '';
	}

	getSettingBoolean(field: keyof DoubanPluginSetting): boolean {
		const setting = this.getSetting(field);
		if (setting) {
			if (typeof setting == 'boolean') {
				return setting;
			}else {
				return !!setting;
			}
		}
		return false;
	}

	resetSetting() {
		this.settings.scoreSetting = DEFAULT_SETTINGS.scoreSetting;
		this.settings.arraySettings = DEFAULT_SETTINGS.arraySettings;
		this.settings.arrayStart = DEFAULT_SETTINGS.arrayStart;
		this.settings.arrayElementStart = DEFAULT_SETTINGS.arrayElementStart;
		this.settings.arraySpiltV2 = DEFAULT_SETTINGS.arraySpiltV2;
		this.settings.arrayElementEnd = DEFAULT_SETTINGS.arrayElementEnd;
		this.settings.arrayEnd = DEFAULT_SETTINGS.arrayEnd;
		this.settings.attachmentPath = DEFAULT_SETTINGS.attachmentPath;
		this.settings.bookTemplateFile = DEFAULT_SETTINGS.bookTemplateFile;
		this.settings.movieTemplateFile = DEFAULT_SETTINGS.movieTemplateFile;
		this.settings.musicTemplateFile = DEFAULT_SETTINGS.musicTemplateFile;
		this.settings.noteTemplateFile = DEFAULT_SETTINGS.noteTemplateFile;
		this.settings.gameTemplateFile = DEFAULT_SETTINGS.gameTemplateFile;
		this.settings.teleplayTemplateFile = DEFAULT_SETTINGS.teleplayTemplateFile;
		this.settings.dateFormat = DEFAULT_SETTINGS.dateFormat;
		this.settings.timeFormat = DEFAULT_SETTINGS.timeFormat;
		this.settings.searchUrl = DEFAULT_SETTINGS.searchUrl;
		this.settings.personNameMode = DEFAULT_SETTINGS.personNameMode;
		this.settings.dataFilePath = DEFAULT_SETTINGS.dataFilePath;
		this.settings.dataFileNamePath = DEFAULT_SETTINGS.dataFileNamePath;
		this.settings.statusBar = DEFAULT_SETTINGS.statusBar;
		this.settings.debugMode = DEFAULT_SETTINGS.debugMode;
		this.settings.cacheImage = DEFAULT_SETTINGS.cacheImage;
		this.settings.cacheHighQuantityImage = DEFAULT_SETTINGS.cacheHighQuantityImage;
	}

	clearLoginInfo() {
		this.settings.loginCookiesContent = DEFAULT_SETTINGS.loginHeadersContent;
		this.settings.loginHeadersContent = DEFAULT_SETTINGS.loginHeadersContent;
	}

	clearSyncCache() {
		this.settings.syncHandledDataArray = [];
	}
}
