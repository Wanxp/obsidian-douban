import {i18nHelper} from "../../lang/helper";
import {CreateTemplateSelectParams} from "./model/CreateTemplateSelectParams";
import { FileSuggest } from "./model/FileSuggest";
import {SearchComponent, Setting} from "obsidian";
import { log } from "src/org/wanxp/utils/Logutil";
import {getDefaultTemplateContent} from "../../constant/DefaultTemplateContent";
import {FolderSuggest} from "./model/FolderSuggest";
import SettingsManager from "./SettingsManager";
import {showFileExample} from "./OutputSettingsHelper";
import {FileTreeSelectSuggest} from "./model/FileTreeSelectSuggest";
import DoubanPlugin from "../../main";
import {FolderTreeSelectSuggest} from "./model/FolderTreeSelectSuggest";


export function constructTemplateUI(containerEl: HTMLElement, manager: SettingsManager) {
	// containerEl.createEl('h3', { text: i18nHelper.getMessage('1203') });
	containerEl.createEl('p', { text: i18nHelper.getMessage('1204') });
	new Setting(containerEl).setDesc(i18nHelper.getMessage('1205'))

	new Setting(containerEl).then(createFileSelectionSetting({containerEl: containerEl, name: '120101', desc: '120102', placeholder: '121701', key: 'movieTemplateFile', manager: manager}));
	new Setting(containerEl).then(createFileSelectionSetting({containerEl: containerEl, name: '120201', desc: '120202', placeholder: '121701', key: 'bookTemplateFile', manager: manager}));
	new Setting(containerEl).then(createFileSelectionSetting({containerEl: containerEl, name: '120301', desc: '120302', placeholder: '121701', key: 'musicTemplateFile', manager: manager}));
	new Setting(containerEl).then(createFileSelectionSetting({containerEl: containerEl, name: '120401', desc: '120402', placeholder: '121701', key: 'noteTemplateFile', manager: manager}));
	new Setting(containerEl).then(createFileSelectionSetting({containerEl: containerEl, name: '121301', desc: '121302', placeholder: '121701', key: 'gameTemplateFile', manager: manager}));
	new Setting(containerEl).then(createFileSelectionSetting({containerEl: containerEl, name: '121801', desc: '121802', placeholder: '121701', key: 'teleplayTemplateFile', manager: manager}));
}

export function createFileSelectionSetting({containerEl, name, desc, placeholder, key, manager
										  }: CreateTemplateSelectParams) {
	return (setting: Setting) => {
		setting.controlEl.addClass('obsidian_douban_template_file_select');
		// @ts-ignore
		setting.setName(i18nHelper.getMessage(name));
		// settingDesc.setDesc(i18nHelper.getMessage(desc));
		setting.addSearch(async (search: SearchComponent) => {
			const [oldValue, defaultVal] = manager.getSettingWithDefault(key);
			let v = defaultVal;
			if (oldValue) {
				v = oldValue;
			}
			const fileTreeSelectSuggest = new FileTreeSelectSuggest(manager.app, search.inputEl, manager, key);
			// @ts-ignore
			search.setValue(v);
			// @ts-ignore
			search.setPlaceholder(i18nHelper.getMessage(placeholder));
			search.inputEl.addClass('obsidian_douban_template_file_select_input');
			search.inputEl.style.width = '100%';
			search.onChange(async (value: string) => {
					manager.updateSetting(key, value);
				});

		});

		setting.addExtraButton((button) => {
			button
				.setIcon('copy')
				.setTooltip(i18nHelper.getMessage('121903'))
				.onClick(async () => {
					// @ts-ignore
					navigator.clipboard.writeText(getDefaultTemplateContent(key))
				});
		});
		setting.addExtraButton((button) => {
			button
				.setIcon('document')
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
										  }: CreateTemplateSelectParams, filePathDisplayExample?:HTMLDivElement) {
	return (setting: Setting) => {
		// @ts-ignore
		setting.setName( i18nHelper.getMessage(name));
		// @ts-ignore
		setting.setDesc( i18nHelper.getMessage(desc));
	};
}



export function createFolderSelectionSettingInput({
																							 name, desc, placeholder, key, manager,
																						 }: CreateTemplateSelectParams, filePathDisplayExample?:HTMLDivElement) {
	return (setting: Setting) => {
		setting.controlEl.addClass('obsidian_douban_template_file_select');
		setting.addSearch(async (search: SearchComponent) => {
			const [oldValue, defaultVal] = manager.getSettingWithDefault(key);
			let v = defaultVal;
			if (oldValue) {
				v = oldValue;
			}
			new FolderTreeSelectSuggest(manager.app, search.inputEl);
			search.inputEl.addClass('obsidian_douban_template_file_select_input');
			search.inputEl.style.width = '100%';
			// @ts-ignore
			search.setValue(v)
				// @ts-ignore
				.setPlaceholder(i18nHelper.getMessage(placeholder))
				.onChange(async (value: string) => {
					manager.updateSetting(key, value);
					if (filePathDisplayExample) {
						showFileExample(filePathDisplayExample, manager);
					}
				});
		});
	};
}

