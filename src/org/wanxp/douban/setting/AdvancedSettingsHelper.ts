import {i18nHelper} from "../../lang/helper";
import {Platform, Setting} from "obsidian";
import {DEFAULT_SETTINGS} from "../../constant/DefaultSettings";
import SettingsManager from "./SettingsManager";
import DoubanLoginModel from "../component/DoubanLoginModel";
import DoubanLogoutModel from "../component/DoubanLogoutModel";
import User from "../user/User";
import {createFolderSelectionSetting} from "./TemplateSettingHelper";
import { log } from "../../utils/Logutil";



export function constructAdvancedUI(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.createEl('h3', { text: i18nHelper.getMessage('1250') });
	containerEl.createEl('p', { text: i18nHelper.getMessage('1252') });
	const settings:Setting = new Setting(containerEl);
	const advancedSettings = containerEl.createDiv('advanced-settings');
	settings.setDesc(i18nHelper.getMessage('1251')).addExtraButton((extraButton) => {
		extraButton
			.setIcon('reset')
			.setTooltip(i18nHelper.getMessage('121905'))
			.onClick(async () => {
				resetAdvanced(manager);
				await manager.plugin.saveSettings();
				showAdvancedSettings(advancedSettings, manager)
			});
	})
	showAdvancedSettings(advancedSettings, manager);

}

function showAdvancedSettings(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.empty();
	new Setting(containerEl)
		.setName(i18nHelper.getMessage('125001'))
		.setDesc(i18nHelper.getMessage('125002'))
		.addToggle((toggleComponent) => {
			toggleComponent
				// .setTooltip(i18nHelper.getMessage('121403'))
				.setValue(manager.plugin.settings.debugMode)
				.onChange(async (value) => {
					manager.plugin.settings.debugMode = value;
					if (value) {
						log.info("调试模式开启");
					}else{
						log.info("调试模式关闭");
					}
					await manager.plugin.saveSettings();
				});
		});
}

function resetAdvanced( manager: SettingsManager) {
	log.info("调试模式关闭");
	manager.plugin.settings.debugMode = false;
}

