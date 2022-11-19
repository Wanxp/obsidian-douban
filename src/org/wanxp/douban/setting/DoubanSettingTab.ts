import {App, PluginSettingTab, SearchComponent, Setting} from "obsidian";

import DoubanPlugin from "../../main";
import {i18nHelper} from "src/org/wanxp/lang/helper";
import {PersonNameMode, PersonNameModeRecords} from "../../constant/Constsant";
import SettingsManager from "./SettingsManager";
import {FolderSuggest} from "./model/FolderSuggest";
import { DEFAULT_SETTINGS } from "src/org/wanxp/constant/DefaultSettings";
import { constructOutUI } from "./OutputSettingsHelper";
import { constructTemplateUI } from "./TemplateSettingHelper";
import { constructBasicUI } from "./BasicSettingsHelper";
import { constructTemplateVariablesUI } from "./TemplateVariableSettingsHelper";
import {constructCustomPropertySettingsUI, constructCustomPropertyUI} from "./CustomPropertySettingsHelper";

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
		constructCustomPropertySettingsUI(containerEl, this.settingsManager);
		constructTemplateVariablesUI(containerEl, this.settingsManager);
	}
}
