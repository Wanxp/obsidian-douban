import {i18nHelper} from "../../lang/helper";
import {CreateTemplateSelectParams} from "@App/setting/model/CreateTemplateSelectParams";
import { FileSuggest } from "./model/FileSuggest";
import {SearchComponent, Setting} from "obsidian";
import { log } from "src/utils/Logutil";
import {getDefaultTemplateContent} from "../../constant/DefaultTemplateContent";
import {FolderSuggest} from "@App/setting/model/FolderSuggest";
import SettingsManager from "@App/setting/SettingsManager";


export function constructTemplateUI(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.createEl('h3', { text: i18nHelper.getMessage('1203') });
	containerEl.createEl('p', { text: i18nHelper.getMessage('1204') });
	new Setting(containerEl).setDesc(i18nHelper.getMessage('1205'))

	new Setting(containerEl).then(createFileSelectionSetting({name: '120101', desc: '120102', placeholder: '121701', key: 'movieTemplateFile', manager: manager}));
	new Setting(containerEl).then(createFileSelectionSetting({name: '120201', desc: '120202', placeholder: '121701', key: 'bookTemplateFile', manager: manager}));
	new Setting(containerEl).then(createFileSelectionSetting({name: '120301', desc: '120302', placeholder: '121701', key: 'musicTemplateFile', manager: manager}));
	new Setting(containerEl).then(createFileSelectionSetting({name: '120401', desc: '120402', placeholder: '121701', key: 'noteTemplateFile', manager: manager}));
	new Setting(containerEl).then(createFileSelectionSetting({name: '121301', desc: '121302', placeholder: '121701', key: 'gameTemplateFile', manager: manager}));
	new Setting(containerEl).then(createFileSelectionSetting({name: '121801', desc: '121802', placeholder: '121701', key: 'teleplayTemplateFile', manager: manager}));
}

export function createFileSelectionSetting({name, desc, placeholder, key, manager
										  }: CreateTemplateSelectParams) {
	return (setting: Setting) => {
		// @ts-ignore
		setting.setName(i18nHelper.getMessage(name));
		// @ts-ignore
		setting.setDesc(i18nHelper.getMessage(desc));
		setting.addSearch(async (search: SearchComponent) => {
			const [oldValue, defaultVal] = manager.getSettingWithDefault(key);
			let v = defaultVal;
			if (oldValue) {
				v = oldValue;
			}
			new FileSuggest(manager.app, search.inputEl);
			// @ts-ignore
			search.setValue(v);
			// @ts-ignore
			search.setPlaceholder(i18nHelper.getMessage(placeholder));
				search.onChange(async (value: string) => {
					manager.updateSetting(key, value);
				});
		});
		setting.addExtraButton((button) => {
			button
				.setIcon('document')
				.setTooltip(i18nHelper.getMessage('121903'))
				.onClick(async () => {
					// @ts-ignore
					navigator.clipboard.writeText(getDefaultTemplateContent(key))
				});
		});
		setting.addExtraButton((button) => {
			button
				.setIcon('copy')
				.setTooltip(i18nHelper.getMessage('121901'))
				.onClick(async () => {
					// @ts-ignore
					navigator.clipboard.writeText(getDefaultTemplateContent(key, false))
				});
		});

	};
}

export function createFolderSelectionSetting({
											  name, desc, placeholder, key, manager,
										  }: CreateTemplateSelectParams) {
	return (setting: Setting) => {
		// @ts-ignore
		setting.setName( i18nHelper.getMessage(name));
		// @ts-ignore
		setting.setDesc( i18nHelper.getMessage(desc));
		setting.addSearch(async (search: SearchComponent) => {
			const [oldValue, defaultVal] = manager.getSettingWithDefault(key);
			let v = defaultVal;
			if (oldValue) {
				v = oldValue;
			}
			new FolderSuggest(manager.app, search.inputEl);
			// @ts-ignore
			search.setValue(v)
				// @ts-ignore
				.setPlaceholder(i18nHelper.getMessage(placeholder))
				.onChange(async (value: string) => {
					manager.updateSetting(key, value);

				});
		});
	};
}



