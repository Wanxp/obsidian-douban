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
import {i18nHelper} from "../../lang/helper";
import {constructLoginUI} from "./LoginSettingsHelper";

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

	  // Create tab container
	  const tabContainer = containerEl.createEl("div", {cls: "obsidian_douban_settings_tab_container"});
	  const tabHeaders = containerEl.createEl("div", {cls: "obsidian_douban_settings_tab_headers"});
	  const tabContents = containerEl.createEl("div", {cls: "obsidian_douban_settings_tab_contents"});

	  // Create tabs
	  const tabs = [
	    {name: i18nHelper.getMessage('1210'), construct: constructBasicUI},
	    {name: i18nHelper.getMessage('1203'), construct: constructTemplateUI},
		  {name: i18nHelper.getMessage('1260'), construct: constructLoginUI},
	    {name: i18nHelper.getMessage('1220'), construct: constructOutUI},
	    {name: i18nHelper.getMessage('120601'), construct: arraySettingDisplayUI},
	    {name: i18nHelper.getMessage('1240'), construct: constructCustomPropertySettingsUI},
	    {name: i18nHelper.getMessage('1230'), construct: constructTemplateVariablesUI},
	    {name: i18nHelper.getMessage('1250'), construct: constructAdvancedUI}
	  ];

	  tabs.forEach((tab, index) => {
	    const tabHeader = tabHeaders.createEl("div", {cls: "obsidian_douban_settings_tab_header", text: tab.name});
	    const tabContent = tabContents.createEl("div", {cls: "obsidian_douban_settings_tab_content"});
      tab.construct(tabContent, this.settingsManager);

	    // Show the first tab by default
	    if (index === 0) {
	      tabHeader.addClass("active");
	      tabContent.addClass("active");
	    }

	    tabHeader.addEventListener("click", () => {
	      // Remove active class from all headers and contents
	      tabHeaders.querySelectorAll(".obsidian_douban_settings_tab_header").forEach(header => header.removeClass("active"));
	      tabContents.querySelectorAll(".obsidian_douban_settings_tab_content").forEach(content => content.removeClass("active"));

	      // Add active class to the clicked header and corresponding content
	      tabHeader.addClass("active");
	      tabContent.addClass("active");
	    });
	  });

	  tabContainer.appendChild(tabHeaders);
	  tabContainer.appendChild(tabContents);
	}

	hide(): void {

	}
}
