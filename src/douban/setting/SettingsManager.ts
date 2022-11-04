import {App, Setting} from "obsidian";
import { DEFAULT_SETTINGS } from "src/constant/DefaultSettings";
import DoubanPlugin from "../../../main";
import { DoubanPluginSetting } from "./model/DoubanPluginSetting";
import {createFileSelectionSetting, createFolderSelectionSetting} from "@App/setting/SettingHelper";
import {i18nHelper} from "../../lang/helper";
import {PersonNameMode, PersonNameModeRecords} from "../../constant/Constsant";

export default class SettingsManager {
	app: App;
	plugin: DoubanPlugin;
	settings:  DoubanPluginSetting;
	cleanupFns: Array<() => void> = [];

	constructor(app: App, plugin: DoubanPlugin) {
		this.app = app;
		this.plugin = plugin;
		this.settings = plugin.settings;
	}

	getSetting(key: keyof DoubanPluginSetting) {

		return [this.settings[key], DEFAULT_SETTINGS[key]];
	}



	async updateSetting(key: keyof DoubanPluginSetting, value:any) {
		// @ts-ignore
		this.settings[key] = value;
		await this.plugin.saveSettings();
	}

	constructBasicUI(containerEl: HTMLElement){
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
			.setName(i18nHelper.getMessage('121401'))
			.setDesc(i18nHelper.getMessage('121402'))
			.addToggle((toggleComponent) => {
				toggleComponent
					// .setTooltip(i18nHelper.getMessage('121403'))
					.setValue(this.plugin.settings.statusBar)
					.onChange(async (value) => {
						this.plugin.settings.statusBar = value;
						await this.plugin.saveSettings();
					});
			});
	}

	constructTemplateUI(containerEl: HTMLElement) {
		containerEl.createEl('h3', { text: i18nHelper.getMessage('1203') });
		containerEl.createEl('p', { text: i18nHelper.getMessage('1204') });
		new Setting(containerEl).setDesc(i18nHelper.getMessage('1205'))

		new Setting(containerEl).then(createFileSelectionSetting({name: '120101', desc: '120102', placeholder: '121701', key: 'movieTemplateFile', manager: this}));
		new Setting(containerEl).then(createFileSelectionSetting({name: '120201', desc: '120202', placeholder: '121701', key: 'bookTemplateFile', manager: this}));
		new Setting(containerEl).then(createFileSelectionSetting({name: '120301', desc: '120302', placeholder: '121701', key: 'musicTemplateFile', manager: this}));
		new Setting(containerEl).then(createFileSelectionSetting({name: '120401', desc: '120402', placeholder: '121701', key: 'noteTemplateFile', manager: this}));
		new Setting(containerEl).then(createFileSelectionSetting({name: '121301', desc: '121302', placeholder: '121701', key: 'gameTemplateFile', manager: this}));
		new Setting(containerEl).then(createFileSelectionSetting({name: '121801', desc: '121802', placeholder: '121701', key: 'teleplayTemplateFile', manager: this}));
	}

	constructOutUI(containerEl: HTMLElement) {
		containerEl.createEl('h3', { text: i18nHelper.getMessage('1220') });
		new Setting(containerEl).then(createFolderSelectionSetting({name: '121501', desc: '121502', placeholder: '121503', key: 'dataFilePath', manager: this}));
		let outfolder = containerEl.createDiv({ cls: 'settings-item' });
		this.constructOutFolderUI(outfolder);

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

	constructTemplateVariablesUI(containerEl: HTMLElement) {
		containerEl.createEl('h3', { text: i18nHelper.getMessage('1230') });
		containerEl.createEl('p', { text: i18nHelper.getMessage('122003') });

		const basicVariablesTable = new DocumentFragment();
		basicVariablesTable.createDiv().innerHTML = `
${i18nHelper.getMessage('122004')}
<br>
<br>
<table border="1">
	<tr>
		<th>${i18nHelper.getMessage('300101')}</th>
		<th>${i18nHelper.getMessage('300102')}</th>
		<th>${i18nHelper.getMessage('300103')}</th>
		<th>${i18nHelper.getMessage('300104')}</th>
		<th>${i18nHelper.getMessage('300105')}</th>
		<th>${i18nHelper.getMessage('300106')}</th>
		<th>${i18nHelper.getMessage('300107')}</th>
		<th>${i18nHelper.getMessage('300108')}</th>
	</tr>
	<tr>
		<td>id</td>
		<td>${i18nHelper.getMessage('310101')}</td>
		<td>${i18nHelper.getMessage('310201')}</td>
		<td>${i18nHelper.getMessage('310301')}</td>
		<td>${i18nHelper.getMessage('310401')}</td>
		<td>${i18nHelper.getMessage('310501')}</td>
		<td>${i18nHelper.getMessage('310601')}</td>
		<td>${i18nHelper.getMessage('310701')}</td>
	</tr>
	<tr>
		<td>title</td>
		<td>${i18nHelper.getMessage('310102')}</td>
		<td>${i18nHelper.getMessage('310202')}</td>
		<td>${i18nHelper.getMessage('310302')}</td>
		<td>${i18nHelper.getMessage('310402')}</td>
		<td>${i18nHelper.getMessage('310502')}</td>
		<td>${i18nHelper.getMessage('310602')}</td>
		<td>${i18nHelper.getMessage('310702')}</td>
	</tr>
	<tr>
		<td>type</td>
		<td>${i18nHelper.getMessage('310103')}</td>
		<td>${i18nHelper.getMessage('310203')}</td>
		<td>${i18nHelper.getMessage('310303')}</td>
		<td>${i18nHelper.getMessage('310403')}</td>
		<td>${i18nHelper.getMessage('310503')}</td>
		<td>${i18nHelper.getMessage('310603')}</td>
		<td>${i18nHelper.getMessage('310703')}</td>
	</tr>
	<tr>
		<td>score</td>
		<td>${i18nHelper.getMessage('310104')}</td>
		<td>${i18nHelper.getMessage('310204')}</td>
		<td>${i18nHelper.getMessage('310304')}</td>
		<td>${i18nHelper.getMessage('310404')}</td>
		<td>${i18nHelper.getMessage('310504')}</td>
		<td>${i18nHelper.getMessage('310604')}</td>
		<td>${i18nHelper.getMessage('310704')}</td>
	</tr>
	<tr>
		<td>image</td>
		<td>${i18nHelper.getMessage('310105')}</td>
		<td>${i18nHelper.getMessage('310205')}</td>
		<td>${i18nHelper.getMessage('310305')}</td>
		<td>${i18nHelper.getMessage('310405')}</td>
		<td>${i18nHelper.getMessage('310505')}</td>
		<td>${i18nHelper.getMessage('310605')}</td>
		<td>${i18nHelper.getMessage('310705')}</td>
	</tr>
	<tr>
		<td>url</td>
		<td>${i18nHelper.getMessage('310106')}</td>
		<td>${i18nHelper.getMessage('310206')}</td>
		<td>${i18nHelper.getMessage('310306')}</td>
		<td>${i18nHelper.getMessage('310406')}</td>
		<td>${i18nHelper.getMessage('310506')}</td>
		<td>${i18nHelper.getMessage('310606')}</td>
		<td>${i18nHelper.getMessage('310706')}</td>
	</tr>
	<tr>
		<td>desc</td>
		<td>${i18nHelper.getMessage('310107')}</td>
		<td>${i18nHelper.getMessage('310207')}</td>
		<td>${i18nHelper.getMessage('310307')}</td>
		<td>${i18nHelper.getMessage('310407')}</td>
		<td>${i18nHelper.getMessage('310507')}</td>
		<td>${i18nHelper.getMessage('310607')}</td>
		<td>${i18nHelper.getMessage('310707')}</td>
		
	</tr>
	<tr>
		<td>publisher</td>
		<td>${i18nHelper.getMessage('310108')}</td>
		<td>${i18nHelper.getMessage('310208')}</td>
		<td>${i18nHelper.getMessage('310308')}</td>
		<td>${i18nHelper.getMessage('310408')}</td>
		<td>${i18nHelper.getMessage('310508')}</td>
		<td>${i18nHelper.getMessage('310608')}</td>
		<td>${i18nHelper.getMessage('310708')}</td>
	</tr>
	<tr>
		<td>datePublished</td>
		<td>${i18nHelper.getMessage('310109')}</td>
		<td>${i18nHelper.getMessage('310209')}</td>
		<td>${i18nHelper.getMessage('310309')}</td>
		<td>${i18nHelper.getMessage('310409')}</td>
		<td>${i18nHelper.getMessage('310509')}</td>
		<td>${i18nHelper.getMessage('310609')}</td>
		<td>${i18nHelper.getMessage('310709')}</td>
	</tr>
	<tr>
		<td>genre</td>
		<td>${i18nHelper.getMessage('310110')}</td>
		<td>${i18nHelper.getMessage('310210')}</td>
		<td>${i18nHelper.getMessage('310310')}</td>
		<td>${i18nHelper.getMessage('310410')}</td>
		<td>${i18nHelper.getMessage('310510')}</td>
		<td>${i18nHelper.getMessage('310610')}</td>
		<td>${i18nHelper.getMessage('310710')}</td>
	</tr>
	<tr>
		<td>currentDate</td>
		<td>${i18nHelper.getMessage('330101')}</td>
		<td>${i18nHelper.getMessage('330101')}</td>
		<td>${i18nHelper.getMessage('330101')}</td>
		<td>${i18nHelper.getMessage('330101')}</td>
		<td>${i18nHelper.getMessage('330101')}</td>
		<td>${i18nHelper.getMessage('330101')}</td>
		<td>${i18nHelper.getMessage('330101')}</td>
	</tr>
	<tr>
		<td>currentTime</td>
		<td>${i18nHelper.getMessage('330102')}</td>
		<td>${i18nHelper.getMessage('330102')}</td>
		<td>${i18nHelper.getMessage('330102')}</td>
		<td>${i18nHelper.getMessage('330102')}</td>
		<td>${i18nHelper.getMessage('330102')}</td>
		<td>${i18nHelper.getMessage('330102')}</td>
		<td>${i18nHelper.getMessage('330102')}</td>
	</tr>
</table>`;

		new Setting(containerEl)
			.setName(i18nHelper.getMessage('122001'))
			.setDesc(basicVariablesTable)
		;


		const extraVariablesTable = new DocumentFragment();
		extraVariablesTable.createDiv().innerHTML = `
${i18nHelper.getMessage('122004')}
<br>
<br>
<table border="1">
	<tr>
		<th>${i18nHelper.getMessage('300101')}</th>
		<th>${i18nHelper.getMessage('300102')}</th>
		<th>${i18nHelper.getMessage('300103')}</th>
		<th>${i18nHelper.getMessage('300104')}</th>
		<th>${i18nHelper.getMessage('300105')}</th>
		<th>${i18nHelper.getMessage('300106')}</th>
		<th>${i18nHelper.getMessage('300107')}</th>
		<th>${i18nHelper.getMessage('300108')}</th>
	</tr>
	<tr>
		<td>${i18nHelper.getMessage('320101')}</th>
		<td>${i18nHelper.getMessage('310111')}</th>
		<td>${i18nHelper.getMessage('310211')}</th>
		<td>${i18nHelper.getMessage('310311')}</th>
		<td>${i18nHelper.getMessage('310411')}</th>
		<td>${i18nHelper.getMessage('310511')}</th>
		<td>${i18nHelper.getMessage('310611')}</th>
		<td>${i18nHelper.getMessage('310711')}</th>
	</tr>
		<td>${i18nHelper.getMessage('320102')}</th>
		<td>${i18nHelper.getMessage('310112')}</th>
		<td>${i18nHelper.getMessage('310212')}</th>
		<td>${i18nHelper.getMessage('310312')}</th>
		<td>${i18nHelper.getMessage('310412')}</th>
		<td>${i18nHelper.getMessage('310512')}</th>
		<td>${i18nHelper.getMessage('310612')}</th>
		<td>${i18nHelper.getMessage('310712')}</th>
	</tr>
	<tr>
		<td>${i18nHelper.getMessage('320103')}</th>
		<td>${i18nHelper.getMessage('310113')}</th>
		<td>${i18nHelper.getMessage('310213')}</th>
		<td>${i18nHelper.getMessage('310313')}</th>
		<td>${i18nHelper.getMessage('310413')}</th>
		<td>${i18nHelper.getMessage('310513')}</th>
		<td>${i18nHelper.getMessage('310613')}</th>
		<td>${i18nHelper.getMessage('310713')}</th>
	</tr>
	<tr>
		<td>${i18nHelper.getMessage('320104')}</th>
		<td>${i18nHelper.getMessage('310114')}</th>
		<td>${i18nHelper.getMessage('310214')}</th>
		<td>${i18nHelper.getMessage('310314')}</th>
		<td>${i18nHelper.getMessage('310414')}</th>
		<td>${i18nHelper.getMessage('310514')}</th>
		<td>${i18nHelper.getMessage('310614')}</th>
		<td>${i18nHelper.getMessage('310714')}</th>
	</tr>
	<tr>
		<td>${i18nHelper.getMessage('320105')}</th>
		<td>${i18nHelper.getMessage('310115')}</th>
		<td>${i18nHelper.getMessage('310215')}</th>
		<td>${i18nHelper.getMessage('310315')}</th>
		<td>${i18nHelper.getMessage('310415')}</th>
		<td>${i18nHelper.getMessage('310515')}</th>
		<td>${i18nHelper.getMessage('310615')}</th>
		<td>${i18nHelper.getMessage('310715')}</th>
	</tr>
	<tr>
		<td>${i18nHelper.getMessage('320106')}</th>
		<td>${i18nHelper.getMessage('310116')}</th>
		<td>${i18nHelper.getMessage('310216')}</th>
		<td>${i18nHelper.getMessage('310316')}</th>
		<td>${i18nHelper.getMessage('310416')}</th>
		<td>${i18nHelper.getMessage('310516')}</th>
		<td>${i18nHelper.getMessage('310616')}</th>
		<td>${i18nHelper.getMessage('310716')}</th>
	</tr>
	<tr>
		<td>${i18nHelper.getMessage('320107')}</th>
		<td>${i18nHelper.getMessage('310117')}</th>
		<td>${i18nHelper.getMessage('310217')}</th>
		<td>${i18nHelper.getMessage('310317')}</th>
		<td>${i18nHelper.getMessage('310417')}</th>
		<td>${i18nHelper.getMessage('310517')}</th>
		<td>${i18nHelper.getMessage('310617')}</th>
		<td>${i18nHelper.getMessage('310717')}</th>
	</tr>
</table>`;


		new Setting(containerEl)
			.setName(i18nHelper.getMessage('122002'))
			.setDesc(extraVariablesTable);
	}

	constructOutFolderUI(containerEl: HTMLElement) {
		containerEl.empty();
		const dataFilePathSetting = new Setting(containerEl)
			.setName(i18nHelper.getMessage('121601'))
			.setDesc(i18nHelper.getMessage('121602'))
			.addText((textField) => {
				textField.setPlaceholder(DEFAULT_SETTINGS.dataFileNamePath)
					.setValue(this.plugin.settings.dataFileNamePath)
					.onChange(async (value) => {
						this.plugin.settings.dataFileNamePath = value;
						await this.plugin.saveSettings();
					});
			});
		dataFilePathSetting.addExtraButton((button) => {
			button
				.setIcon('reset')
				.setTooltip(i18nHelper.getMessage('121902'))
				.onClick(async () => {
					this.plugin.settings.dataFileNamePath = DEFAULT_SETTINGS.dataFileNamePath;
					await this.plugin.saveSettings();
					this.constructOutFolderUI(containerEl)
				});
		})
	}
}
