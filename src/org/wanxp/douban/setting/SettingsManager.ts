import {App, Setting} from "obsidian";
import { DEFAULT_SETTINGS } from "src/org/wanxp/constant/DefaultSettings";
import DoubanPlugin from "../../main";
import Logger from "../../utils/Logutil";
import { DoubanPluginSetting } from "./model/DoubanPluginSetting";
import StringUtil from "../../utils/StringUtil";
import {DEFAULT_DOUBAN_HEADERS} from "../../constant/Constsant";

export default class SettingsManager {
	app: App;
	plugin: DoubanPlugin;
	settings:  DoubanPluginSetting;
	cleanupFns: Array<() => void> = [];
	innerLogger: Logger = new Logger();

	cookieTemp:string;

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

}
