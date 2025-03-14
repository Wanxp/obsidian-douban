import {i18nHelper} from "../../lang/helper";
import {Platform, Setting} from "obsidian";
import {DEFAULT_SETTINGS} from "../../constant/DefaultSettings";
import SettingsManager from "./SettingsManager";
import DoubanLoginModel from "../component/DoubanLoginModel";
import DoubanLogoutModel from "../component/DoubanLogoutModel";
import User from "../user/User";
import {createFolderSelectionSetting} from "./TemplateSettingHelper";
import { log } from "../../utils/Logutil";
import {ConfirmDialogModal} from "../component/ConfirmDialogModal";
import {DoubanSearchModal} from "../data/search/DoubanSearchModal";
import {DoubanPluginSetting} from "./model/DoubanPluginSetting";
import TimeUtil from "../../utils/TimeUtil";



export function constructAdvancedUI(containerEl: HTMLElement, manager: SettingsManager) {
	// containerEl.createEl('h3', { text: i18nHelper.getMessage('1250') });
	containerEl.createEl('p', { text: i18nHelper.getMessage('1252') });

	// const settings:Setting = new Setting(containerEl);
	const advancedSettings = containerEl.createDiv('advanced-settings');
// 	settings.setDesc(i18nHelper.getMessage('1251')).addExtraButton((extraButton) => {
// 		extraButton
// 			.setIcon('reset')
// 			.setTooltip(i18nHelper.getMessage('121905'))
// 			.onClick(async () => {
// 				resetAdvanced(manager);
// 				await manager.plugin.saveSettings();
// 				showAdvancedSettings(advancedSettings, manager)
// 			});
// 	})
	showAdvancedSettings(advancedSettings, manager);
//
}

function showAdvancedSettings(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.empty();
	const promise:Promise<any> = new Promise<any>((resolve, reject) => {resolve(null)});


	//导出
	new Setting(containerEl)
		.setName(i18nHelper.getMessage('125034'))
		.setDesc(i18nHelper.getMessage('125035'))
		.addButton((buttonComponent) => {
			buttonComponent
				.setIcon('folder')
				.setButtonText(i18nHelper.getMessage('125047'))
				.onClick(async (value) => {
					const settings = manager.getSettings()
					const settingsString = JSON.stringify(settings, null, 2);
					const blob = new Blob([settingsString], { type: 'application/json' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = `obsidian_douban_plugin_settings_${TimeUtil.formatDate(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.json`;
					a.click();
					URL.revokeObjectURL(url);

				});
		});
	//导入
	new Setting(containerEl)
		.setName(i18nHelper.getMessage('125036'))
		.setDesc(i18nHelper.getMessage('125037'))
		.addButton((buttonComponent) => {
			buttonComponent
				.setIcon('document')
				.setButtonText(i18nHelper.getMessage('125039'))
				.onClick(async (value) => {
					showConfirmDialog(i18nHelper.getMessage('125046'), promise.then(() => {
					}), manager);
				});
		});



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
	new Setting(containerEl)
		.setName(i18nHelper.getMessage('125011'))
		.setDesc(i18nHelper.getMessage('125012'))
		.addButton((buttonComponent) => {
			buttonComponent
				.setIcon('reset')
				.setTooltip(i18nHelper.getMessage('125013'))
				.onClick(async (value) => {
					showConfirmDialog(i18nHelper.getMessage('125012'),
						promise.then(() => {
							manager.resetSetting();
						}), manager)
				});
		});
	new Setting(containerEl)
		.setName(i18nHelper.getMessage('125021'))
		.setDesc(i18nHelper.getMessage('125022'))
		.addButton((buttonComponent) => {
			buttonComponent
				.setIcon('reset')
				.setTooltip(i18nHelper.getMessage('125022'))
				.onClick(async (value) => {
					showConfirmDialog(i18nHelper.getMessage('125022'),
						promise.then(() => {
							manager.clearLoginInfo();
							manager.plugin.userComponent.logout()
						}), manager)
				});
		});

	new Setting(containerEl)
		.setName(i18nHelper.getMessage('125031'))
		.setDesc(i18nHelper.getMessage('125032'))
		.addButton((buttonComponent) => {
			buttonComponent
				.setIcon('reset')
				.setTooltip(i18nHelper.getMessage('125032'))
				.onClick(async (value) => {
					showConfirmDialog(i18nHelper.getMessage('125032'), promise.then(() => {
						manager.clearSyncCache();
					}), manager);
				});
		});

}

function resetAdvanced( manager: SettingsManager) {
	log.info("调试模式关闭");
	manager.plugin.settings.debugMode = false;
}

function showConfirmDialog(message:string, promise:Promise<any>, manager: SettingsManager) {
	new ConfirmDialogModal(manager.plugin, message, promise
		.then( () => {
			manager.plugin.saveSettings();
		})
		.then( () => {
			manager.plugin.settingTab.display();
		})
	).open();
}

