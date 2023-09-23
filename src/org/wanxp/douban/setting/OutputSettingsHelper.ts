import {i18nHelper} from "../../lang/helper";
import {Setting, TextComponent} from "obsidian";
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

	constructOutputFileNameUI(outfolder, manager);

	let arrSettings = containerEl.createDiv('array-settings');
	let arrShow = containerEl.createDiv('array-show');

	const descFrag:DocumentFragment = new DocumentFragment();
	const desc:	HTMLElement = descFrag.createDiv('array-setting-desc')
	desc.innerHTML = i18nHelper.getMessage('120602');
	new Setting(arrSettings)
		.setName(i18nHelper.getMessage('120601'))
		.setDesc(descFrag);
	arrSettings;

	arrSettings.createEl('label', { text: i18nHelper.getMessage('124109') })
	const arrayStart = new TextComponent(arrSettings);
	arrayStart.setPlaceholder(DEFAULT_SETTINGS.arrayStart)
		.setValue(manager.settings.arrayStart)
		.onChange(async (value) => {
			manager.plugin.settings.arrayStart = value;
			await manager.plugin.saveSettings();
			showArrayExample(arrShow, manager);
		});
	let arrayStartEl = arrayStart.inputEl;
	arrayStartEl.size = 3;
	arrayStartEl.addClass('obsidian_douban_settings_input')
	arrSettings.appendChild(arrayStartEl).appendText("  ");

	arrSettings.createEl('label', { text: i18nHelper.getMessage('124110') })
	const arrayElementStart = new TextComponent(arrSettings);
	arrayElementStart.setPlaceholder(DEFAULT_SETTINGS.arrayElementStart)
		.setValue(manager.settings.arrayElementStart)
		.onChange(async (value) => {
			manager.plugin.settings.arrayElementStart = value;
			await manager.plugin.saveSettings();
			showArrayExample(arrShow, manager);
		});
	let arrayElementStartEl = arrayElementStart.inputEl;
	arrayElementStartEl.addClass('obsidian_douban_settings_input')
	arrayElementStartEl.size = 3;
	arrSettings.appendChild(arrayElementStartEl).appendText("  ");

	arrSettings.createEl('label', { text: i18nHelper.getMessage('124111') })
	const arraySpiltV2 = new TextComponent(arrSettings);
	arraySpiltV2.setPlaceholder(DEFAULT_SETTINGS.arraySpiltV2)
		.setValue(manager.settings.arraySpiltV2)
		.onChange(async (value) => {
			manager.plugin.settings.arraySpiltV2 = value;
			await manager.plugin.saveSettings();
			showArrayExample(arrShow, manager);
		});
	let arraySpiltV2El = arraySpiltV2.inputEl;
	arraySpiltV2El.addClass('obsidian_douban_settings_input')
	arraySpiltV2El.size = 3;
	arrSettings.appendChild(arraySpiltV2El).appendText("  ");

	arrSettings.createEl('label', { text: i18nHelper.getMessage('124112') })
	const arrayElementEnd = new TextComponent(arrSettings);
	arrayElementEnd.setPlaceholder(DEFAULT_SETTINGS.arrayElementEnd)
		.setValue(manager.settings.arrayElementEnd)
		.onChange(async (value) => {
			manager.plugin.settings.arrayElementEnd = value;
			await manager.plugin.saveSettings();
			showArrayExample(arrShow, manager);
		});
	let arrayElementEndEl = arrayElementEnd.inputEl;
	arrayElementEndEl.addClass('obsidian_douban_settings_input')
	arrayElementEndEl.size = 3;
	arrSettings.appendChild(arrayElementEndEl).appendText("  ");

	arrSettings.createEl('label', { text: i18nHelper.getMessage('124113') })
	const arrayEnd = new TextComponent(arrSettings);
	arrayEnd.setPlaceholder(DEFAULT_SETTINGS.arrayEnd)
		.setValue(manager.settings.arrayEnd)
		.onChange(async (value) => {
			manager.plugin.settings.arrayEnd = value;
			await manager.plugin.saveSettings();
			showArrayExample(arrShow, manager);
		});
	let arrayEndEl = arrayEnd.inputEl;
	arrayEndEl.addClass('obsidian_douban_settings_input')
	arrayEndEl.size = 3;
	arrSettings.appendChild(arrayEndEl).appendText("  ");
	showArrayExample(arrShow, manager);


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


export function constructOutputFileNameUI(containerEl: HTMLElement, manager: SettingsManager) {
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
				constructOutputFileNameUI(containerEl, manager)
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
		new Setting(containerEl)
			.setName(i18nHelper.getMessage('121435'))
			.setDesc(i18nHelper.getMessage('121436'))
			.addToggle((toggleComponent) => {
				toggleComponent
					.setTooltip(i18nHelper.getMessage('121437'))
					.setValue(manager.plugin.settings.cacheHighQuantityImage)
					.onChange(async (value) => {
						manager.plugin.settings.cacheHighQuantityImage = value;
						await manager.plugin.saveSettings();
						constructAttachmentFileSettingsUI(containerEl, manager);
					});
			});
	}
}
function showArrayExample(arrShow: HTMLDivElement, manager: SettingsManager) {
	arrShow.empty();
	let document = new DocumentFragment();
	document.createDiv('array-show-title')
		.innerHTML = `propertyName:${manager.handleArray(['value1', 'value2', 'value3'])}`;

	new Setting(arrShow)
		.setName(i18nHelper.getMessage('120603'))
		.setDesc(document);

}
