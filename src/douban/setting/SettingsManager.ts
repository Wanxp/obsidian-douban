import {App, Setting} from "obsidian";
import { DEFAULT_SETTINGS } from "src/constant/DefaultSettings";
import DoubanPlugin from "../../../main";
import { DoubanPluginSetting } from "./model/DoubanPluginSetting";
import {createFileSelectionSetting, createFolderSelectionSetting} from "@App/setting/TemplateSettingHelper";
import {i18nHelper} from "../../lang/helper";
import {PersonNameMode, PersonNameModeRecords} from "../../constant/Constsant";
import {constructBasicUI} from "@App/setting/BasicSettingsHelper";

export default class SettingsManager {
	app: App;
	plugin: DoubanPlugin;
	settings:  DoubanPluginSetting;
	cleanupFns: Array<() => void> = [];

	constructor(app: App, plugin: DoubanPlugin) {
		this.app = app;
		this.plugin = plugin;
		this.settings = plugin.settings;
	}

	getSetting(key: keyof DoubanPluginSetting) {

		return [this.settings[key], DEFAULT_SETTINGS[key]];
	}



	async updateSetting(key: keyof DoubanPluginSetting, value:any) {
		// @ts-ignore
		this.settings[key] = value;
		await this.plugin.saveSettings();
	}

}
