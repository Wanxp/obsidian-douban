import {App, PluginSettingTab,  Setting} from "obsidian";

import DoubanPlugin from "../../main";
import SettingsManager from "./SettingsManager";
import { constructOutUI } from "./OutputSettingsHelper";
import { constructTemplateUI } from "./TemplateSettingHelper";
import { constructBasicUI } from "./BasicSettingsHelper";
import { constructTemplateVariablesUI } from "./TemplateVariableSettingsHelper";
import {constructCustomPropertySettingsUI } from "./CustomPropertySettingsHelper";
import { constructAdvancedUI } from "./AdvancedSettingsHelper";
import {arraySettingDisplay, arraySettingDisplayUI} from "./ArrayDisplayTypeSettingsHelper";

/**
 * 部分逻辑参考以下项目
 * obsidian-kanban
 */
export class DoubanSettingTab extends PluginSettingTab {
	plugin: DoubanPlugin;
	settingsManager: SettingsManager;

	constructor(app: App, plugin: DoubanPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.settingsManager = plugin.settingsManager;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();
		containerEl.createEl("h2", {text: 'Obsidian Douban'});
		new Setting(containerEl);
		constructBasicUI(containerEl, this.settingsManager);
		constructTemplateUI(containerEl, this.settingsManager);
		constructOutUI(containerEl, this.settingsManager);
		arraySettingDisplayUI(containerEl,  this.settingsManager);
		constructCustomPropertySettingsUI(containerEl, this.settingsManager);
		constructTemplateVariablesUI(containerEl, this.settingsManager);
		constructAdvancedUI(containerEl, this.settingsManager);

	}

	hide(): void {

	}
}
