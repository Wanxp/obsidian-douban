import {App, Setting} from "obsidian";
import { DEFAULT_SETTINGS } from "src/constant/DefaultSettings";
import DoubanPlugin from "../../../main";
import { DoubanPluginSetting } from "./model/DoubanPluginSetting";
import {createFileSelectionSetting, createFolderSelectionSetting} from "@App/setting/SettingHelper";

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
		this.settings[key] = value;
		await this.plugin.saveSettings();
	}

	constructUI(contenterEl: HTMLElement) {
		new Setting(contenterEl).then(createFileSelectionSetting({name: '120101', desc: '120102', placeholder: '121701', key: 'movieTemplateFile', manager: this}));
		new Setting(contenterEl).then(createFileSelectionSetting({name: '120201', desc: '120202', placeholder: '121701', key: 'bookTemplateFile', manager: this}));
		new Setting(contenterEl).then(createFileSelectionSetting({name: '120301', desc: '120302', placeholder: '121701', key: 'musicTemplateFile', manager: this}));
		new Setting(contenterEl).then(createFileSelectionSetting({name: '120401', desc: '120402', placeholder: '121701', key: 'noteTemplateFile', manager: this}));
		new Setting(contenterEl).then(createFileSelectionSetting({name: '121301', desc: '121302', placeholder: '121701', key: 'gameTemplateFile', manager: this}));
		new Setting(contenterEl).then(createFileSelectionSetting({name: '121301', desc: '121302', placeholder: '121701', key: 'teleplayTemplateFile', manager: this}));
		new Setting(contenterEl).then(createFolderSelectionSetting({name: '121301', desc: '121302', placeholder: '121701', key: 'dataFilePath', manager: this}));
	}

}
