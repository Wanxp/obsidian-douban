import { App, PluginSettingTab, Setting } from "obsidian";
import { DEFAULT_SETTINGS, PersonNameMode, personNameModeRecords } from "./Douban";

import DoubanPlugin from "main";
import { i18nHelper } from "lang/helper";
import { log } from "utils/Logutil";

export class DoubanSettingTab extends PluginSettingTab {
	plugin: DoubanPlugin;
  
	constructor(app: App, plugin: DoubanPlugin) {
	  super(app, plugin);
	  this.plugin = plugin;
	}
  
	display(): void {
	  let { containerEl } = this;
  
	  containerEl.empty();
  
	  containerEl.createEl("h2", { text: "Obsidian Douban" });

		new Setting(containerEl).setName(i18nHelper.getMessage('douban search url'))
		.then((setting) => {
			setting.addText((textField) => {
			  setting.descEl.appendChild(
				createFragment((frag) => {
				  frag.appendText(i18nHelper.getMessage('douban search url desc 1'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('douban search url desc 2'));
				  frag.createEl(
					'a',
					{
					  text: i18nHelper.getMessage('Douban'),
					  href: 'https://www.douban.com',
					},
					(a) => {
					  a.setAttr('target', '_blank');
					}
				  );
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('douban search url desc 3'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('douban search url desc 4'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('douban search url desc 5'));
				  frag.createEl('br');
				})
			  );
			  textField.inputEl.addClass("settings_textField");
			  textField
			  .setPlaceholder(DEFAULT_SETTINGS.searchUrl)
			  .setValue(this.plugin.settings.searchUrl)
			  .onChange(async (value) => {
				this.plugin.settings.searchUrl = value;
				await this.plugin.saveSettings();
			  });

			});
		  });

		new Setting(containerEl).setName(i18nHelper.getMessage("movie content template")).then((setting) => {
			setting.addTextArea((textarea) => {
			  setting.descEl.appendChild(
				createFragment((frag) => {
				  frag.appendText(i18nHelper.getMessage('movie content template desc 1'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('movie content template desc 2'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('movie content template desc 3'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('movie content template desc 4'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('movie content template desc 5'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('movie content template desc 6'));
				  frag.createEl('br');
				})
			  );
			  textarea.inputEl.addClass("settings_area");
			  textarea.inputEl.setAttr("rows", 10);
			  textarea.setPlaceholder(DEFAULT_SETTINGS.movieTemplate)
			  .setValue(this.plugin.settings.movieTemplate)
			  .onChange(async (value) => {
				this.plugin.settings.movieTemplate = value;
				await this.plugin.saveSettings();
			  });
			});
		  });

		  new Setting(containerEl).setName(i18nHelper.getMessage("book content template")).then((setting) => {
			setting.addTextArea((textarea) => {
			  setting.descEl.appendChild(
				createFragment((frag) => {
				  frag.appendText(i18nHelper.getMessage('book content template desc 1'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('book content template desc 2'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('book content template desc 3'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('book content template desc 4'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('book content template desc 5'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('book content template desc 6'));
				  frag.createEl('br');
				})
			  );
			  textarea.inputEl.addClass("settings_area");
			  textarea.inputEl.setAttr("rows", 10);
			  textarea.setPlaceholder(DEFAULT_SETTINGS.bookTemplate)
			  .setValue(this.plugin.settings.bookTemplate)
			  .onChange(async (value) => {
				this.plugin.settings.bookTemplate = value;
				await this.plugin.saveSettings();
			  });
			});
		  });

		  new Setting(containerEl).setName(i18nHelper.getMessage("Person Name Language Mode")).then((setting) => {
			setting.addDropdown((dropdwon) => {
			  setting.descEl.appendChild(
				createFragment((frag) => {
				  frag.appendText(i18nHelper.getMessage('options:'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('Chinese Name mode, only show Chinese name'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('English Name mode, only show English name'));
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('Chinese English Name mode, show Chinese English name both'));
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




		new Setting(containerEl).setName(i18nHelper.getMessage('Date format')).then((setting) => {
			setting.addMomentFormat((mf) => {
			  setting.descEl.appendChild(
				createFragment((frag) => {
				  frag.appendText(
					i18nHelper.getMessage('This format will be used when available template variables contain date.')
				  );
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('For more syntax, refer to') + ' ');
				  frag.createEl(
					'a',
					{
					  text: i18nHelper.getMessage('format reference'),
					  href: 'https://momentjs.com/docs/#/displaying/format/',
					},
					(a) => {
					  a.setAttr('target', '_blank');
					}
				  );
				  frag.createEl('br');
				  frag.appendText(i18nHelper.getMessage('Your current syntax looks like this') + ': ');
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


		new Setting(containerEl)
		.setName(i18nHelper.getMessage("Array Spilt String"))
		.setDesc(i18nHelper.getMessage(`string to join between array type, such as author, actor`))
		.addText((textField) => {
		  	textField.setPlaceholder(DEFAULT_SETTINGS.arraySpilt)
			.setValue(this.plugin.settings.arraySpilt)
			.onChange(async (value) => {
			  this.plugin.settings.arraySpilt = value;
			  await this.plugin.saveSettings();
			});
		});



		// new Setting(containerEl)
		// .setName("Douban Request Headers")
		// .setDesc(`if can not fetch data from douban,\n
		//  please go to douban.com\n and copy headers to this text area  `)
		// .addTextArea((textField) => {
		//   textField
		//   	.setPlaceholder(DEFAULT_SETTINGS.searchHeaders)
		// 	.setValue(this.plugin.settings.searchHeaders)
		// 	.onChange(async (value) => {
		// 	  this.plugin.settings.searchHeaders = value;
		// 	  await this.plugin.saveSettings();
		// 	});
		// });
  

	}
  }