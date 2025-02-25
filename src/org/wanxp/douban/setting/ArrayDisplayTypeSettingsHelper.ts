import SettingsManager from "./SettingsManager";
import {ArraySetting, DEFAULT_SETTINGS_ARRAY_NAME} from "./model/ArraySetting";
import {Setting, TextComponent} from "obsidian";
import {i18nHelper} from "../../lang/helper";
import {DEFAULT_SETTINGS} from "../../constant/DefaultSettings";
import {DEFAULT_SETTINGS_ARRAY_INPUT_SIZE} from "../../constant/Constsant";
import DoubanPlugin from "../../main";


export function arraySettingDisplayUI(containerEl: HTMLElement, manager: SettingsManager) {
	// containerEl.createEl('h3', {text: i18nHelper.getMessage('120601')});
	arraySettingDisplay(containerEl.createDiv('array-settings'), manager, true);
}

export function arraySettingDisplay(containerEl: HTMLElement, manager: SettingsManager, displayExtraListTypeFlag: boolean = true) {
	containerEl.empty();
	const arraySet = new Setting(containerEl)
		.setName(i18nHelper.getMessage('120601'))
		.setDesc( i18nHelper.getMessage('120602'))
		.addButton((button) => {
			button
				.setIcon('plus')
				.setTooltip(i18nHelper.getMessage('120607'))
				.onClick(async () => {
					await manager.addArraySetting();
					arraySettingDisplay(containerEl, manager, true);
				});
		});
	// if (displayExtraListTypeFlag) {
	new Setting(containerEl)
	arraySettingDisplayItem(containerEl, manager, manager.getArraySetting(DEFAULT_SETTINGS_ARRAY_NAME));
	displayExtraListType(manager, containerEl);
		// arraySet.addButton((button) => {
		// 	button
		// 		.setIcon('down-chevron-glyph')
		// 		.setTooltip(i18nHelper.getMessage('120608'))
		// 		.onClick(async () => {
		// 			arraySettingDisplay(containerEl, manager, false);
		// 		});
		// });
	// }else {
	// 	arraySet.addButton((button) => {
	// 		button
	// 			.setIcon('right-chevron-glyph')
	// 			.setTooltip(i18nHelper.getMessage('120608'))
	// 			.onClick(async () => {
	// 				arraySettingDisplay(containerEl, manager, true);
	// 			});
	// 	});
	// }
}

function arraySettingDisplayItem(containerEl: HTMLElement, manager: SettingsManager, arraySetting:ArraySetting) {
	const arrSettingsUI = containerEl.createDiv('array-settings');
	const arrShow = containerEl.createDiv('array-show');
	const typeName = arraySetting.arrayName;
	const arraySettingItems = new Setting(arrSettingsUI)
		.setName(i18nHelper.getMessage('120604') + typeName )
		.setDesc(i18nHelper.getMessage(`120605`) + (typeName == DEFAULT_SETTINGS_ARRAY_NAME ? '' : `(${typeName})`) +`}}`)
	;
	if(typeName != DEFAULT_SETTINGS_ARRAY_NAME) {
		arraySettingItems.addButton((button) => {
			button
				.setIcon('trash')
				.setTooltip(i18nHelper.getMessage('120606'))
				.onClick(async () => {
					await manager.removeArraySetting(arraySetting.arrayName);
					arraySettingDisplay(containerEl, manager, true);
				});
		});
	}

	arrSettingsUI.createEl('label', {text: i18nHelper.getMessage('124109')})
	const arrayStart = new TextComponent(arrSettingsUI);
	arrayStart.setPlaceholder(DEFAULT_SETTINGS.arrayStart)
		.setValue(arraySetting.arrayStart)
		.onChange(async (value) => {
			arraySetting.arrayStart = value;
			await manager.updateArraySetting(arraySetting);
			showArrayExample(arrShow, manager, arraySetting);
		});
	const arrayStartEl = arrayStart.inputEl;
	arrayStartEl.size = DEFAULT_SETTINGS_ARRAY_INPUT_SIZE;
	arrayStartEl.addClass('obsidian_douban_settings_input')
	arrSettingsUI.appendChild(arrayStartEl).appendText("  ");

	arrSettingsUI.createEl('label', {text: i18nHelper.getMessage('124110')})
	const arrayElementStart = new TextComponent(arrSettingsUI);
	arrayElementStart.setPlaceholder(DEFAULT_SETTINGS.arrayElementStart)
		.setValue(arraySetting.arrayElementStart)
		.onChange(async (value) => {
			arraySetting.arrayElementStart = value;
			await manager.updateArraySetting(arraySetting);
			showArrayExample(arrShow, manager, arraySetting);
		});
	const arrayElementStartEl = arrayElementStart.inputEl;
	arrayElementStartEl.addClass('obsidian_douban_settings_input')
	arrayElementStartEl.size = DEFAULT_SETTINGS_ARRAY_INPUT_SIZE;
	arrSettingsUI.appendChild(arrayElementStartEl).appendText("  ");

	arrSettingsUI.createEl('label', {text: i18nHelper.getMessage('124111')})
	const arraySpiltV2 = new TextComponent(arrSettingsUI);
	arraySpiltV2.setPlaceholder(DEFAULT_SETTINGS.arraySpiltV2)
		.setValue(arraySetting.arraySpiltV2)
		.onChange(async (value) => {
			arraySetting.arraySpiltV2 = value;
			await manager.updateArraySetting(arraySetting);
			showArrayExample(arrShow, manager, arraySetting);
		});
	const arraySpiltV2El = arraySpiltV2.inputEl;
	arraySpiltV2El.addClass('obsidian_douban_settings_input')
	arraySpiltV2El.size = 2;
	arrSettingsUI.appendChild(arraySpiltV2El).appendText("  ");

	arrSettingsUI.createEl('label', {text: i18nHelper.getMessage('124112')})
	const arrayElementEnd = new TextComponent(arrSettingsUI);
	arrayElementEnd.setPlaceholder(DEFAULT_SETTINGS.arrayElementEnd)
		.setValue(arraySetting.arrayElementEnd)
		.onChange(async (value) => {
			arraySetting.arrayElementEnd = value;
			await manager.updateArraySetting(arraySetting);
			showArrayExample(arrShow, manager, arraySetting);
		});
	const arrayElementEndEl = arrayElementEnd.inputEl;
	arrayElementEndEl.addClass('obsidian_douban_settings_input')
	arrayElementEndEl.size = DEFAULT_SETTINGS_ARRAY_INPUT_SIZE;
	arrSettingsUI.appendChild(arrayElementEndEl).appendText("  ");

	arrSettingsUI.createEl('label', {text: i18nHelper.getMessage('124113')})
	const arrayEnd = new TextComponent(arrSettingsUI);
	arrayEnd.setPlaceholder(DEFAULT_SETTINGS.arrayEnd)
		.setValue(arraySetting.arrayEnd)
		.onChange(async (value) => {
			arraySetting.arrayEnd = value;
			await manager.updateArraySetting(arraySetting);
			showArrayExample(arrShow, manager, arraySetting);
		});
	const arrayEndEl = arrayEnd.inputEl;
	arrayEndEl.addClass('obsidian_douban_settings_input')
	arrayEndEl.size = DEFAULT_SETTINGS_ARRAY_INPUT_SIZE;
	arrSettingsUI.appendChild(arrayEndEl).appendText("  ");

	showArrayExample(arrShow, manager, arraySetting);
}

function displayExtraListType(manager: SettingsManager, containerEl: HTMLElement) {
	manager.settings.arraySettings.forEach(arraySetting => {
		new Setting(containerEl)
		arraySettingDisplayItem(containerEl, manager, arraySetting);
	})
}


function showArrayExample(arrShow: HTMLDivElement, manager: SettingsManager, arraySetting:ArraySetting) {
	arrShow.empty();
	const document = new DocumentFragment();
	document.createDiv('array-show-title')
		.innerHTML = `propertyName:${manager.handleArray(['value1', 'value2', 'value3'], arraySetting)}`;

	new Setting(arrShow)
		.setName(i18nHelper.getMessage('120603'))
		.setDesc(document);

}
