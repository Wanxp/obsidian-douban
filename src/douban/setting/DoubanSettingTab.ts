import {App, PluginSettingTab, SearchComponent, Setting} from "obsidian";

import DoubanPlugin from "main";
import {i18nHelper} from "src/lang/helper";
import {PersonNameMode, PersonNameModeRecords} from "../../constant/Constsant";
import SettingsManager from "@App/setting/SettingsManager";
import {FolderSuggest} from "@App/setting/model/FolderSuggest";
import { DEFAULT_SETTINGS } from "src/constant/DefaultSettings";

/**
 * 部分逻辑参考以下项目
 * obsidian-kanban
 */
export class DoubanSettingTab extends PluginSettingTab {
	plugin: DoubanPlugin;
	settingsManager: SettingsManager;
	constructor(app: App, plugin: DoubanPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.settingsManager = new SettingsManager(app, plugin);
	}

	display(): void {
		const {containerEl} = this;


		containerEl.empty();

		containerEl.createEl("h2", {text: 'Obsidian Douban'});

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
						.setValue(this.plugin.settings.searchUrl)
						.onChange(async (value) => {
							this.plugin.settings.searchUrl = value;
							await this.plugin.saveSettings();
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
				mf.setValue(this.plugin.settings.dateFormat)
				mf.onChange(async (value) => {
					this.plugin.settings.dateFormat = value;
					await this.plugin.saveSettings();
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
				mf.setValue(this.plugin.settings.timeFormat)
				mf.onChange(async (value) => {
					this.plugin.settings.timeFormat = value;
					await this.plugin.saveSettings();
				});

			});
		});


		new Setting(containerEl)
			.setName(i18nHelper.getMessage('120601'))
			.setDesc(i18nHelper.getMessage('120602'))
			.addText((textField) => {
				textField.setPlaceholder(DEFAULT_SETTINGS.arraySpilt)
					.setValue(this.plugin.settings.arraySpilt)
					.onChange(async (value) => {
						this.plugin.settings.arraySpilt = value;
						await this.plugin.saveSettings();
					});
			});

		this.settingsManager.constructUI(containerEl);

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
				dropdwon.setValue(this.plugin.settings.personNameMode)
					.onChange(async (value: string) => {
						this.plugin.settings.personNameMode = value as PersonNameMode;
						await this.plugin.saveSettings();
					});
			});
		});




	}
}
