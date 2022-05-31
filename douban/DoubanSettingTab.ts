import DoubanPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class DoubanSettingTab extends PluginSettingTab {
	plugin: DoubanPlugin;
  
	constructor(app: App, plugin: DoubanPlugin) {
	  super(app, plugin);
	  this.plugin = plugin;
	}
  
	display(): void {
	  let { containerEl } = this;
  
	  containerEl.empty();
  
	  containerEl.createEl("h2", { text: "Obsidian Wikipedia" });
  
	  new Setting(containerEl)
		.setName("Douban Search Url")
		.setDesc(`full search url with https ahead `)
		.addText((textField) => {
		  textField
			.setValue(this.plugin.settings.searchUrl)
			.onChange(async (value) => {
			  this.plugin.settings.searchUrl = value;
			  await this.plugin.saveSettings();
			});
		});

		new Setting(containerEl)
		.setName("Douban Request Headers")
		.setDesc(`full search url with https ahead `)
		.addText((textField) => {
		  textField
			.setValue(this.plugin.settings.searchHeaders)
			.onChange(async (value) => {
			  this.plugin.settings.searchHeaders = value;
			  await this.plugin.saveSettings();
			});
		});
  
	  new Setting(containerEl)
		.setName("Content Template")
		.setDesc(
		  `Set markdown template for extract to be inserted.\n
		  Available template variables are {{id}}, {{type}}, {{title}}, {{score}}, {{cast}}, {{desc}} and {{url}}.
		  `
		)
		.addTextArea((textarea) =>
		  textarea
			.setValue(this.plugin.settings.template)
			.onChange(async (value) => {
			  this.plugin.settings.template = value;
			  await this.plugin.saveSettings();
			})
		);
	}
  }