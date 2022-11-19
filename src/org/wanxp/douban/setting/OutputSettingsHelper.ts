import {i18nHelper} from "../../lang/helper";
import {Setting} from "obsidian";
import {createFolderSelectionSetting} from "./TemplateSettingHelper";
import {DEFAULT_SETTINGS} from "../../constant/DefaultSettings";
import {PersonNameMode, PersonNameModeRecords} from "../../constant/Constsant";
import SettingsManager from "./SettingsManager";

export function constructOutUI(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.createEl('h3', { text: i18nHelper.getMessage('1220') });

	new Setting(containerEl);
	let attachmentFileSetting = containerEl.createDiv({ cls: 'settings-item-attachment' });
	constructAttachmentFileSettingsUI(attachmentFileSetting, manager);

	new Setting(containerEl).then(createFolderSelectionSetting({name: '121501', desc: '121502', placeholder: '121503', key: 'dataFilePath', manager: manager}));
	let outfolder = containerEl.createDiv({ cls: 'settings-item' });

	constructOutFolderUI(outfolder, manager);

	new Setting(containerEl)
		.setName(i18nHelper.getMessage('120601'))
		.setDesc(i18nHelper.getMessage('120602'))
		.addText((textField) => {
			textField.setPlaceholder(DEFAULT_SETTINGS.arraySpilt)
				.setValue(manager.plugin.settings.arraySpilt)
				.onChange(async (value) => {
					manager.plugin.settings.arraySpilt = value;
					await manager.plugin.saveSettings();
				});
		});

	new Setting(containerEl).setName(i18nHelper.getMessage('121201')).then((setting) => {
		setting.addDropdown((dropdwon) => {
			setting.descEl.appendChild(
				createFragment((frag) => {
					frag.appendText(i18nHelper.getMessage('121202'));
					frag.createEl('br');
					frag.appendText(i18nHelper.getMessage('121203'));
					frag.createEl('br');
					frag.appendText(i18nHelper.getMessage('121204'));
					frag.createEl('br');
					frag.appendText(i18nHelper.getMessage('121205'));
					frag.createEl('br');
				})
			);
			//   dropdwon.inputEl.addClass("settings_area");
			//   dropdwon.inputEl.setAttr("rows", 10);
			dropdwon.addOption(PersonNameMode.CH_NAME, PersonNameModeRecords.CH)
			dropdwon.addOption(PersonNameMode.EN_NAME, PersonNameModeRecords.EN)
			dropdwon.addOption(PersonNameMode.CH_EN_NAME, PersonNameModeRecords.CH_EN)
			dropdwon.setValue(manager.plugin.settings.personNameMode)
				.onChange(async (value: string) => {
					manager.plugin.settings.personNameMode = value as PersonNameMode;
					await manager.plugin.saveSettings();
				});
		});
	});
}


export function constructOutFolderUI(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.empty();
	const dataFilePathSetting = new Setting(containerEl)
		.setName(i18nHelper.getMessage('121601'))
		.setDesc(i18nHelper.getMessage('121602'))
		.addText((textField) => {
			textField.setPlaceholder(DEFAULT_SETTINGS.dataFileNamePath)
				.setValue(manager.plugin.settings.dataFileNamePath)
				.onChange(async (value) => {
					manager.plugin.settings.dataFileNamePath = value;
					await manager.plugin.saveSettings();
				});
		});
	dataFilePathSetting.addExtraButton((button) => {
		button
			.setIcon('reset')
			.setTooltip(i18nHelper.getMessage('121902'))
			.onClick(async () => {
				manager.plugin.settings.dataFileNamePath = DEFAULT_SETTINGS.dataFileNamePath;
				await manager.plugin.saveSettings();
				constructOutFolderUI(containerEl, manager)
			});
	})
}


export function constructAttachmentFileSettingsUI(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.empty();
	new Setting(containerEl)
		.setName(i18nHelper.getMessage('121430'))
		.setDesc(i18nHelper.getMessage('121431'))
		.addToggle((toggleComponent) => {
			toggleComponent
				// .setTooltip(i18nHelper.getMessage('121403'))
				.setValue(manager.plugin.settings.cacheImage)
				.onChange(async (value) => {
					manager.plugin.settings.cacheImage = value;
					await manager.plugin.saveSettings();
					constructAttachmentFileSettingsUI(containerEl, manager);
				});
		});

	if(manager.plugin.settings.cacheImage) {
		new Setting(containerEl).then(createFolderSelectionSetting({name: '121432', desc: '121433', placeholder: '121434', key: 'attachmentPath', manager: manager}));
	}
}
