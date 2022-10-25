import { App, PluginSettingTab, Setting } from "obsidian";
import { DEFAULT_SETTINGS, PersonNameMode, personNameModeRecords } from "./Douban";

import DoubanPlugin from "main";
import { i18nHelper } from "src/lang/helper";

export class DoubanSettingTab extends PluginSettingTab {
	plugin: DoubanPlugin;
  
	constructor(app: App, plugin: DoubanPlugin) {
	  super(app, plugin);
	  this.plugin = plugin;
	}
  
	display(): void {
	  let { containerEl } = this;
  
	  containerEl.empty();
  
	  containerEl.createEl("h2", { text: i18nHelper.getMessage('1201') });

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

		new Setting(containerEl).setName(i18nHelper.getMessage('120101')).then((setting) => {
			setting.addTextArea((textarea) => {
			  setting.descEl.appendChild(
				createFragment((frag) => {
				  frag.appendText(i18nHelper.getMessage('120102'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120103'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120104'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120105'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120106'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120107'));
				  frag.createEl('br');
				})
			  );
			  textarea.inputEl.addClass("obsidian_douban_settings_area");
			  textarea.inputEl.setAttr("rows", 10);
			  textarea.setPlaceholder(DEFAULT_SETTINGS.movieTemplate)
			  .setValue(this.plugin.settings.movieTemplate)
			  .onChange(async (value) => {
				this.plugin.settings.movieTemplate = value;
				await this.plugin.saveSettings();
			  });
			});
		  });

		  new Setting(containerEl).setName(i18nHelper.getMessage('120201')).then((setting) => {
			setting.addTextArea((textarea) => {
			  setting.descEl.appendChild(
				createFragment((frag) => {
				  frag.appendText(i18nHelper.getMessage('120202'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120203'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120204'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120205'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120206'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120207'));
				  frag.createEl('br');
				})
			  );
			  textarea.inputEl.addClass("obsidian_douban_settings_area");
			  textarea.inputEl.setAttr("rows", 10);
			  textarea.setPlaceholder(DEFAULT_SETTINGS.bookTemplate)
			  .setValue(this.plugin.settings.bookTemplate)
			  .onChange(async (value) => {
				this.plugin.settings.bookTemplate = value;
				await this.plugin.saveSettings();
			  });
			});
		  });

		  new Setting(containerEl).setName(i18nHelper.getMessage('120301')).then((setting) => {
			setting.addTextArea((textarea) => {
			  setting.descEl.appendChild(
				createFragment((frag) => {
				  frag.appendText(i18nHelper.getMessage('120302'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120303'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120304'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120305'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120306'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120307'));
				  frag.createEl('br');
				})
			  );
			  textarea.inputEl.addClass("obsidian_douban_settings_area");
			  textarea.inputEl.setAttr("rows", 10);
			  textarea.setPlaceholder(DEFAULT_SETTINGS.musicTemplate)
			  .setValue(this.plugin.settings.musicTemplate)
			  .onChange(async (value) => {
				this.plugin.settings.musicTemplate = value;
				await this.plugin.saveSettings();
			  });
			});
		  });

		  new Setting(containerEl).setName(i18nHelper.getMessage("120401")).then((setting) => {
			setting.addTextArea((textarea) => {
			  setting.descEl.appendChild(
				createFragment((frag) => {
				  frag.appendText(i18nHelper.getMessage('120402'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120403'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120404'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120405'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('120406'));
				  frag.createEl('br');

				})
			  );
			  textarea.inputEl.addClass("obsidian_douban_settings_area");
			  textarea.inputEl.setAttr("rows", 10);
			  textarea.setPlaceholder(DEFAULT_SETTINGS.noteTemplate)
			  .setValue(this.plugin.settings.noteTemplate)
			  .onChange(async (value) => {
				this.plugin.settings.noteTemplate = value;
				await this.plugin.saveSettings();
			  });
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
			dropdwon.addOption(PersonNameMode.CH_NAME, personNameModeRecords.CH)
			dropdwon.addOption(PersonNameMode.EN_NAME, personNameModeRecords.EN)
			dropdwon.addOption(PersonNameMode.CH_EN_NAME, personNameModeRecords.CH_EN)
			dropdwon.setValue(this.plugin.settings.personNameMode)
			  .onChange(async (value:string) => {
				this.plugin.settings.personNameMode = value as PersonNameMode;
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
				  mf.setSampleEl(frag.createEl('b', { cls: 'u-pop' }));
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
				  mf.setSampleEl(frag.createEl('b', { cls: 'u-pop' }));
				  frag.createEl('br');
				})
			  );
			  mf.setPlaceholder(DEFAULT_SETTINGS.dateTimeFormat);
			  mf.setValue(this.plugin.settings.dateTimeFormat)
			  mf.onChange(async (value) => {
				this.plugin.settings.dateTimeFormat = value;
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

	}
  }
