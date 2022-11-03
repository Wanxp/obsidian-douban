import {i18nHelper} from "../../lang/helper";
import {CreateTemplateSelectParams} from "@App/setting/model/CreateTemplateSelectParams";
import { FileSuggest } from "./model/FileSuggest";
import {SearchComponent, Setting} from "obsidian";
import { log } from "src/utils/Logutil";


export function createFileSelectionSetting({
											  name, desc, placeholder, key, manager,
										  }: CreateTemplateSelectParams) {
	return (setting: Setting) => {
		// @ts-ignore
		setting.setName( i18nHelper.getMessage(name));

		const templateDesc = new DocumentFragment();
		// @ts-ignore
		templateDesc.createDiv().innerHTML = i18nHelper.getMessage(desc) + `<br> <text class="obsidian_douban_settings_desc has_error" >不存在文件夹</> `;
		setting.setDesc(templateDesc);
		setting.addSearch(async (search: SearchComponent) => {
			const [oldValue, defaultVal] = manager.getSetting(key);
			let v = defaultVal;
			if (oldValue) {
				v = oldValue;
			}
			const fs = new FileSuggest(manager.app, search.inputEl);
			search.setValue(v);
			// @ts-ignore
			search.setPlaceholder(i18nHelper.getMessage(placeholder));
				search.onChange(async (value: string) => {
					log.trace(`hange to : ${value} `)
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



