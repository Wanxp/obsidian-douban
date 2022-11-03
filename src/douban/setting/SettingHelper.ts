import {i18nHelper} from "../../lang/helper";
import {CreateTemplateSelectParams} from "@App/setting/model/CreateTemplateSelectParams";
import { FileSuggest } from "./model/FileSuggest";
import {SearchComponent, Setting} from "obsidian";


export function createFileSelectionSetting({
											  name, desc, placeholder, key, manager,
										  }: CreateTemplateSelectParams) {
	return (setting: Setting) => {
		// @ts-ignore
		setting.setName( i18nHelper.getMessage(name));
		// @ts-ignore
		setting.setDesc( i18nHelper.getMessage(desc));
		setting.addSearch(async (search: SearchComponent) => {
			const [oldValue, defaultVal] = manager.getSetting(key);
			let v = defaultVal;
			if (oldValue) {
				v = oldValue;
			}
			new FileSuggest(manager.app, search.inputEl);
			search.setValue(v);
			// @ts-ignore
			search.setPlaceholder(i18nHelper.getMessage());
				search.onChange(async (value: string) => {
					manager.updateSetting(key, value);

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
			const [oldValue, defaultVal] = manager.getSetting(key);
			let v = defaultVal;
			if (oldValue) {
				v = oldValue;
			}
			new FileSuggest(manager.app, search.inputEl);
			search
				.setValue(v)
				// @ts-ignore
				.setPlaceholder(i18nHelper.getMessage(placeholder))
				.onChange(async (value: string) => {
					manager.updateSetting(key, value);

				});
		});
	};
}



