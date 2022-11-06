import {i18nHelper} from "../../lang/helper";
import {Setting} from "obsidian";
import {DEFAULT_SETTINGS} from "../../constant/DefaultSettings";
import SettingsManager from "@App/setting/SettingsManager";

export function constructBasicUI(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.createEl('h3', { text: i18nHelper.getMessage('1210') });
	new Setting(containerEl).setName(i18nHelper.getMessage('120001'))
		.then((setting) => {
			setting.addText((textField) => {
				setting.descEl.appendChild(
					createFragment((frag) => {
						frag.appendText(i18nHelper.getMessage('120002'));
						frag.createEl('br');
						frag.appendText(i18nHelper.getMessage('120003'));
						frag.createEl(
							'a',
							{
								text: i18nHelper.getMessage('120901'),
								href: 'https://www.douban.com',
							},
							(a) => {
								a.setAttr('target', '_blank');
							}
						);
						frag.createEl('br');
						frag.appendText(i18nHelper.getMessage('120004'));
						frag.createEl('br');
						frag.appendText(i18nHelper.getMessage('120005'));
						frag.createEl('br');
						frag.appendText(i18nHelper.getMessage('120006'));
						frag.createEl('br');
					})
				);
				textField.inputEl.addClass("obsidian_douban_settings_textField");
				textField
					.setPlaceholder(DEFAULT_SETTINGS.searchUrl)
					.setValue(manager.plugin.settings.searchUrl)
					.onChange(async (value) => {
						manager.plugin.settings.searchUrl = value;
						await manager.plugin.saveSettings();
					});

			});
		});

	new Setting(containerEl).setName(i18nHelper.getMessage('120501')).then((setting) => {
		setting.addMomentFormat((mf) => {
			setting.descEl.appendChild(
				createFragment((frag) => {
					frag.appendText(
						i18nHelper.getMessage('120503')
					);
					frag.createEl('br');
					frag.appendText(i18nHelper.getMessage('120506') + ' ');
					frag.createEl(
						'a',
						{
							text: i18nHelper.getMessage('120508'),
							href: 'https://momentjs.com/docs/#/displaying/format/',
						},
						(a) => {
							a.setAttr('target', '_blank');
						}
					);
					frag.createEl('br');
					frag.appendText(i18nHelper.getMessage('120507') + ': ');
					mf.setSampleEl(frag.createEl('b', {cls: 'u-pop'}));
					frag.createEl('br');
				})
			);
			mf.setPlaceholder(DEFAULT_SETTINGS.dateFormat);
			mf.setValue(manager.plugin.settings.dateFormat)
			mf.onChange(async (value) => {
				manager.plugin.settings.dateFormat = value;
				await manager.plugin.saveSettings();
			});

		});
	});

	new Setting(containerEl).setName(i18nHelper.getMessage('120502')).then((setting) => {
		setting.addMomentFormat((mf) => {
			setting.descEl.appendChild(
				createFragment((frag) => {
					frag.appendText(
						i18nHelper.getMessage('120504')
					);
					frag.createEl('br');
					frag.appendText(i18nHelper.getMessage('120506') + ' ');
					frag.createEl(
						'a',
						{
							text: i18nHelper.getMessage('120508'),
							href: 'https://momentjs.com/docs/#/displaying/format/',
						},
						(a) => {
							a.setAttr('target', '_blank');
						}
					);
					frag.createEl('br');
					frag.appendText(i18nHelper.getMessage('120507') + ': ');
					mf.setSampleEl(frag.createEl('b', {cls: 'u-pop'}));
					frag.createEl('br');
				})
			);
			mf.setPlaceholder(DEFAULT_SETTINGS.timeFormat);
			mf.setValue(manager.plugin.settings.timeFormat)
			mf.onChange(async (value) => {
				manager.plugin.settings.timeFormat = value;
				await manager.plugin.saveSettings();
			});

		});
	});

	new Setting(containerEl)
		.setName(i18nHelper.getMessage('121401'))
		.setDesc(i18nHelper.getMessage('121402'))
		.addToggle((toggleComponent) => {
			toggleComponent
				// .setTooltip(i18nHelper.getMessage('121403'))
				.setValue(manager.plugin.settings.statusBar)
				.onChange(async (value) => {
					manager.plugin.settings.statusBar = value;
					await manager.plugin.saveSettings();
				});
		});
}
