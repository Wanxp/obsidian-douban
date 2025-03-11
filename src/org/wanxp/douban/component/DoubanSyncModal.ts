import {
	App,
	ButtonComponent, DropdownComponent,
	Modal, SearchComponent, Setting, TextComponent, ValueComponent,
} from "obsidian";

import DoubanPlugin from "../../main";
import {i18nHelper} from "src/org/wanxp/lang/helper";
import HandleContext from "../data/model/HandleContext";
import {
	DEFAULT_SETTINGS_ARRAY_INPUT_SIZE,
	SupportType, SyncConditionType,
	SyncConditionTypeRecords,
	SyncType,
	SyncTypeRecords
} from "../../constant/Constsant";
import {
	ALL, DoubanSubjectState, DoubanSubjectStateRecords,
	DoubanSubjectStateRecords_BOOK_SYNC,
	DoubanSubjectStateRecords_BROADCAST_SYNC, DoubanSubjectStateRecords_GAME_SYNC,
	DoubanSubjectStateRecords_MOVIE_SYNC,
	DoubanSubjectStateRecords_MUSIC_SYNC,
	DoubanSubjectStateRecords_NOTE_SYNC,
	DoubanSubjectStateRecords_TELEPLAY_SYNC
} from "../../constant/DoubanUserState";
import {SyncConfig} from "../sync/model/SyncConfig";
import {clearInterval} from "timers";
import {FolderSuggest} from "../setting/model/FolderSuggest";
import {DEFAULT_SETTINGS} from "../../constant/DefaultSettings";
import {createFileSelectionSetting} from "../setting/TemplateSettingHelper";
import {FileSuggest} from "../setting/model/FileSuggest";
import {getDefaultTemplateContent} from "../../constant/DefaultTemplateContent";
import TimeUtil from "../../utils/TimeUtil";
import SettingsManager from "../setting/SettingsManager";
import {ArraySetting, DEFAULT_SETTINGS_ARRAY_NAME} from "../setting/model/ArraySetting";
import {arraySettingDisplay} from "../setting/ArrayDisplayTypeSettingsHelper";
import {DatePickComponent} from "./DatePickComponent";
import {NumberComponent} from "./NumberComponent";
import {log} from "../../utils/Logutil";

export class DoubanSyncModal extends Modal {
	plugin: DoubanPlugin;
	context: HandleContext
	timer: any;

	constructor(app: App, plugin: DoubanPlugin, context: HandleContext) {
		super(app);
		this.plugin = plugin;
		this.context = context;
	}

	onOpen() {
		let {contentEl} = this;
		this.show(contentEl);
	}

	private show(contentEl: HTMLElement) {
		contentEl.empty();
		if (this.plugin.statusHolder.syncing()) {
			this.showSyncStatus(contentEl);
		} else {
			this.showSyncConfig(contentEl);
		}
	}

	private showSyncStatus(contentEl: HTMLElement) {
		const {syncStatus} = this.plugin.statusHolder;
		const {syncConfig} = syncStatus;
		contentEl.createEl("h3", {text: i18nHelper.getMessage('500002')});

		this.showConfigPan(contentEl.createDiv('config'), syncConfig, true);

		const sliderDiv = contentEl.createEl('div');
		sliderDiv.addClass('obsidian_douban_sync_slider');
		const controls = contentEl.createDiv("controls");

		const stopButton = new ButtonComponent(controls)
			.setButtonText(i18nHelper.getMessage('110009'))
			.onClick(async () => {
				this.close();
				await this.plugin.statusHolder.stopSync();
			})

		const backgroundButton = new ButtonComponent(controls)
			.setButtonText(i18nHelper.getMessage('110010'))
			.onClick(() => {
				this.close();
			});

		this.showProgress(sliderDiv, backgroundButton, stopButton);

		this.timer = setInterval(() => {
			this.showProgress(sliderDiv,backgroundButton, stopButton);
		}, 1000);

		backgroundButton.setClass("obsidian_douban_status_button");
		stopButton.setClass("obsidian_douban_status_button");

	}


	private showProgress(sliderDiv: HTMLDivElement, backgroundButton:ButtonComponent, stopButton:ButtonComponent) {
		sliderDiv.empty();
		new Setting(sliderDiv);
		let progress = sliderDiv.createDiv('progress');
		const {syncStatus} = this.plugin.statusHolder;
		if (!this.plugin.statusHolder.syncStarted) {
			progress.innerHTML = `<p>
    <label for="file">${i18nHelper.getMessage('110033')}</label>
    <progress class="obsidian_douban_sync_slider" max="${syncStatus.getTotal() == 0 ? 1:syncStatus.getTotal()}" value="${syncStatus.getHasHandle()}"> </progress> <span> ${syncStatus.getHasHandle()}/${syncStatus.getTotal()}:${i18nHelper.getMessage('110036')}  </span>
</p>
<p>
<label for="file">${i18nHelper.getMessage('110092')}</label>
<span>${i18nHelper.getMessage('110090', syncStatus.getTypeName(), syncStatus.getScopeName(), syncStatus.getAllTotal(), syncStatus.getTotal())}</span>
</p>
<p>
<label for="file">${i18nHelper.getMessage('110091')}</label>
<span>${syncStatus.getMessage()}</span>
</p>
`
			backgroundButton.setDisabled(true);
			stopButton.setButtonText(i18nHelper.getMessage('110036'))
			return;
		}
		progress.innerHTML = `<p>
    <label for="file">${i18nHelper.getMessage('110033')}</label>
    <progress class="obsidian_douban_sync_slider" max="${syncStatus.getTotal() == 0 ? 1:syncStatus.getTotal()}" value="${syncStatus.getHasHandle()}"> </progress> <span> ${syncStatus.getTotal() == 0 ? i18nHelper.getMessage('110043') : syncStatus.getHasHandle() + '/' + syncStatus.getTotal()}
${syncStatus.getHandle() == 0? '...' : i18nHelper.getMessage('110042') + ':' + TimeUtil.estimateTimeMsg(syncStatus.getNeedHandled()-syncStatus.getHandle(), syncStatus.getOverSize())} </span>
</p>
<p>
<label for="file">${i18nHelper.getMessage('110092')}</label>
<span>${i18nHelper.getMessage('110090', syncStatus.getTypeName(), syncStatus.getScopeName(), syncStatus.getAllTotal(), syncStatus.getTotal())}</span>
</p>
<p>
<label for="file">${i18nHelper.getMessage('110091')}</label>
<span>${syncStatus.getMessage()}</span>
</p>
`}

	private showSyncConfig(contentEl: HTMLElement) {
		if (this.timer != null) {
			clearInterval(this.timer)
		}
		contentEl.createEl("h3", {text: i18nHelper.getMessage('500001')});
		const {settings} =  this.plugin;
		let syncConfig:SyncConfig = {syncType: SyncType.movie, scope: ALL,
			force: false,
			dataFilePath: (settings.dataFilePath == '' || settings.dataFilePath == null) ? DEFAULT_SETTINGS.dataFilePath : settings.dataFilePath,
			dataFileNamePath: (settings.dataFileNamePath == '' || settings.dataFileNamePath == null) ?  DEFAULT_SETTINGS.dataFileNamePath : settings.dataFileNamePath,
			cacheImage: ( settings.cacheImage == null) ?  DEFAULT_SETTINGS.cacheImage : settings.cacheImage,
			cacheHighQuantityImage: ( settings.cacheHighQuantityImage == null) ?  DEFAULT_SETTINGS.cacheHighQuantityImage : settings.cacheHighQuantityImage,
			attachmentPath: (settings.attachmentPath == '' || settings.attachmentPath == null) ?  DEFAULT_SETTINGS.attachmentPath : settings.attachmentPath,
			templateFile:  (settings.movieTemplateFile == '' || settings.movieTemplateFile == null) ? DEFAULT_SETTINGS.movieTemplateFile : settings.movieTemplateFile,
			incrementalUpdate: true,
			syncConditionType: SyncConditionType.ALL,
			syncConditionDateFromValue: TimeUtil.getLastMonth(),
			syncConditionDateToValue: new Date(),
			syncConditionCountFromValue: 1,
			syncConditionCountToValue: 30
		};
		this.showConfigPan(contentEl.createDiv('config'), syncConfig, false);
		const controls = contentEl.createDiv("controls");
		const cancelButton = new ButtonComponent(controls)
			.setButtonText(i18nHelper.getMessage('110005'))
			.onClick(() => {
				this.close();
			});
		const syncButton = new ButtonComponent(controls)
			.setButtonText(i18nHelper.getMessage('110007'))
			.onClick(async () => {
				if (!this.plugin.userComponent.isLogin()) {
					await this.plugin.userComponent.login();
				}
				if(!await this.plugin.checkLogin(this.context)) {
					return;
				}
				syncButton.setDisabled(true);
				if(!this.plugin.statusHolder.startSync(syncConfig)) {
					return;
				}
				this.updateContextByConfig(syncConfig);
				this.show(contentEl);
				await this.plugin.sync(this.context);
			})


		syncButton.setClass("obsidian_douban_search_button");
		cancelButton.setClass("obsidian_douban_search_button");

	}

	private updateContextByConfig(syncConfig: SyncConfig) {
		const { context} = this;
		context.syncConfig = syncConfig;
		context.syncActive = true;
	}

	private showConfigPan(contentEl: HTMLElement, config:SyncConfig, disable:boolean) {
		new Setting(contentEl);
		this.showTypeDropdown(contentEl, config, disable);
		this.showCondition(contentEl, config, disable);
		// this.showOutputFolderSelections(contentEl, config, disable);
		// this.showOutiFleName(contentEl, config, disable);
		// this.showAttachmentsFileConfig(contentEl, config, disable);
		this.showUpdateAllConfig(contentEl, config, disable);
		this.showForceUpdateConfig(contentEl, config, disable);
	}

	async onClose() {
		let {contentEl} = this;
		contentEl.empty();
		if (this.timer != null) {
			clearInterval(this.timer);
		}
	}

	private openScopeDropdown(contentEl:HTMLDivElement, config: SyncConfig, disable:boolean) {
		switch (config.syncType) {
			case SyncType.movie:
				this.showScopeDropdown(contentEl, DoubanSubjectStateRecords_MOVIE_SYNC, config, disable);
				break;
			case SyncType.book:
				this.showScopeDropdown(contentEl, DoubanSubjectStateRecords_BOOK_SYNC, config, disable);
				break;
			case SyncType.broadcast:
				this.showScopeDropdown(contentEl, DoubanSubjectStateRecords_BROADCAST_SYNC, config, disable);
				break;
			case SyncType.note:
				this.showScopeDropdown(contentEl, DoubanSubjectStateRecords_NOTE_SYNC, config, disable);
				break;
			case SyncType.music:
				this.showScopeDropdown(contentEl, DoubanSubjectStateRecords_MUSIC_SYNC, config, disable);
				break;
			case SyncType.teleplay:
				this.showScopeDropdown(contentEl, DoubanSubjectStateRecords_TELEPLAY_SYNC, config, disable);
				break;
			case SyncType.game:
				config.scope = DoubanSubjectState.collect;
				this.showScopeDropdown(contentEl, DoubanSubjectStateRecords_GAME_SYNC, config, disable);
				break;
		}
	}

	private showTypeDropdown(containerEl:HTMLElement, config: SyncConfig, disable:boolean) {
		const settings = new Setting(containerEl);
		const scopeSelections = containerEl.createDiv("scope-selection");
		// const templateFile:HTMLDivElement = containerEl.createDiv('template-file-path-selection');
		settings
			.setName(i18nHelper.getMessage('110030'))
			.addDropdown((dropdown) => {
				dropdown.addOptions(SyncTypeRecords)
					.setValue(config.syncType)
					.onChange((value) => {
						config.syncType = value;
						config.templateFile = this.getDefaultTemplatePath(value);
						this.openScopeDropdown(scopeSelections, config, disable);
						// this.showTemplateFileSelectionSetting(templateFile, config, disable);
					});
			}).setDisabled(disable);
		this.openScopeDropdown(scopeSelections, config, disable);
		// this.showTemplateFileSelectionSetting(templateFile, config, disable);
	}

	private getDefaultTemplatePath(value: string) {
		let result:string = "";
		const {settings} = this.plugin;
		switch (value) {
			case SyncType.movie:
				result = (settings.movieTemplateFile == '' || settings.movieTemplateFile == null) ? DEFAULT_SETTINGS.movieTemplateFile : settings.movieTemplateFile
				break;
			case SyncType.book:
				result = (settings.bookTemplateFile == '' || settings.bookTemplateFile == null) ? DEFAULT_SETTINGS.bookTemplateFile : settings.bookTemplateFile
				break;
			case SyncType.music:
				result = (settings.musicTemplateFile == '' || settings.musicTemplateFile == null) ? DEFAULT_SETTINGS.musicTemplateFile : settings.musicTemplateFile
				break;
			case SyncType.teleplay:
				result = (settings.teleplayTemplateFile == '' || settings.teleplayTemplateFile == null) ? DEFAULT_SETTINGS.teleplayTemplateFile : settings.teleplayTemplateFile
				break;
			case SyncType.game:
				result = (settings.gameTemplateFile == '' || settings.gameTemplateFile == null) ? DEFAULT_SETTINGS.gameTemplateFile : settings.gameTemplateFile
				break;
		}
		return result;
	}

	private showScopeDropdown(containerEl:HTMLDivElement, scopeSelections: Record<string, string>, config: SyncConfig, disable:boolean) {
		containerEl.empty();
		new Setting(containerEl)
			.setName(i18nHelper.getMessage('110032'))
			.addDropdown((dropdown) => {
				dropdown.addOptions(scopeSelections)
				dropdown.setValue(config.scope)
					.onChange(async (value: string) => {
						config.scope = value;
					});
			}).setDisabled(disable);
	}

	private showOutiFleName(containerEl: HTMLElement, config: SyncConfig, disable:boolean) {
		const dataFilePathSetting = new Setting(containerEl)
			.setName(i18nHelper.getMessage('121601'))
			.setDesc(i18nHelper.getMessage('121602'))
			.addText((textField) => {
				textField.setPlaceholder(i18nHelper.getMessage('121602'))
					.setValue(config.dataFileNamePath)
					.onChange(async (value) => {
						config.dataFileNamePath = value
					});
			})
			.setDisabled(disable);
	}

	showOutputFolderSelections(containerEl: HTMLElement, config: SyncConfig, disable:boolean) {
		new Setting(containerEl)
			.setName( i18nHelper.getMessage('121501'))
			.setDesc( i18nHelper.getMessage('121502'))
			.addSearch(async (search: SearchComponent) => {
				new FolderSuggest(this.app, search.inputEl);
				// @ts-ignore
				search.setValue(config.dataFilePath)
					// @ts-ignore
					.setPlaceholder(i18nHelper.getMessage('121503'))
					.onChange(async (value: string) => {
						config.dataFilePath = value;
					});
			})
			.setDisabled(disable);
	}

	showTemplateFileSelectionSetting(containerEl: HTMLElement, config: SyncConfig, disable:boolean) {
		containerEl.empty();
		const key:string = this.getKey(config.syncType);
		// @ts-ignore
		let setting = new Setting(containerEl)
			.setName(i18nHelper.getMessage('121101'))
			.setDesc(i18nHelper.getMessage('121102'))
			.addSearch(async (search: SearchComponent) => {
				new FileSuggest(this.app, search.inputEl);
				// @ts-ignore
				search.setValue(config.templateFile)
					// @ts-ignore
					.onChange(async (value: string) => {
						config.templateFile = value;
					});
			})
			.setDisabled(disable);

		setting.addExtraButton((button) => {
			button
				.setIcon('copy')
				.setTooltip(i18nHelper.getMessage('121903'))
				.onClick(async () => {
					// @ts-ignore
					navigator.clipboard.writeText(getDefaultTemplateContent(key));
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


	}


	private getKey(supportType: string) {
		return supportType + 'TemplateFile';
	}

	showForceUpdateConfig(containerEl: HTMLElement, config: SyncConfig, disable:boolean) {
		new Setting(containerEl)
			.setName(i18nHelper.getMessage('110031'))
			.setDesc(i18nHelper.getMessage('500110'))
			.addToggle((toggleComponent) => {
				toggleComponent
					// .setTooltip(i18nHelper.getMessage('121403'))
					.setValue(config.force)
					.onChange(async (value) => {
						config.force = value;
					});
			})
			.setDisabled(disable);
	}



	showAttachmentsFileConfig(containerEl: HTMLElement, config: SyncConfig, disable:boolean) {
		const settings = new Setting(containerEl);
		let attachmentFileEl = containerEl.createDiv('attachment-file-path-selection');
		settings.setName(i18nHelper.getMessage('121430'))
			.setDesc(i18nHelper.getMessage('121431'))
			.addToggle((toggleComponent) => {
				toggleComponent
					// .setTooltip(i18nHelper.getMessage('121403'))
					.setValue(config.cacheImage)
					.onChange(async (value) => {
						config.cacheImage = value;
						this.showAttachmentPathSelections(value, attachmentFileEl, config, disable);
					});
			})
			.setDisabled(disable);
		this.showAttachmentPathSelections(config.cacheImage, attachmentFileEl, config, disable);
	}

	showAttachmentPathSelections(show:boolean, containerEl: HTMLElement, config: SyncConfig, disable:boolean) {
		containerEl.empty();
		if (!show) {
			return;
		}
		new Setting(containerEl)
			.setName( i18nHelper.getMessage('121432'))
			.setDesc( i18nHelper.getMessage('121433'))
			.addSearch(async (search: SearchComponent) => {
				new FolderSuggest(this.plugin.app, search.inputEl);
				// @ts-ignore
				search.setValue(config.attachmentPath)
					// @ts-ignore
					.setPlaceholder(i18nHelper.getMessage('121434'))
					.onChange(async (value: string) => {
						config.attachmentPath = value;
					});
			})
			.setDisabled(disable);

		new Setting(containerEl)
			.setName(i18nHelper.getMessage('121435'))
			.setDesc(i18nHelper.getMessage('121438'))
			.addToggle((toggleComponent) => {
				toggleComponent
					.setValue(config.cacheHighQuantityImage)
					.onChange(async (value) => {
						config.cacheHighQuantityImage = value;
					});
			})
			.setDisabled(disable);
	}

	showUpdateAllConfig(containerEl: HTMLElement, config: SyncConfig, disable:boolean) {
		new Setting(containerEl)
			.setName(i18nHelper.getMessage('110039'))
			.setDesc(i18nHelper.getMessage('110040'))
			.addToggle((toggleComponent) => {
				toggleComponent
					.setTooltip(i18nHelper.getMessage('110040'))
					.setValue(config.incrementalUpdate)
					.onChange(async (value) => {
						config.incrementalUpdate = value;
					});
			})
			.setDisabled(disable);
	}

	private showCondition(contentEl: HTMLElement, config: SyncConfig, disable: boolean) {
		showConditionItem(contentEl.createDiv("sync-douban-condition"), this.plugin.settingsManager, config, disable);
	}
}

function showConditionItem(containerEl: HTMLElement, manager: SettingsManager, config: SyncConfig, disable: boolean) {
	containerEl.empty();
	const condition = new Setting(containerEl).setName(i18nHelper.getMessage('110070'))

	const conditionDesc = condition.descEl.createDiv('sync-douban-condition-desc');
	new DropdownComponent(conditionDesc).addOptions(SyncConditionTypeRecords)
		.setValue(config.syncConditionType)
		.onChange((value) => {
			config.syncConditionType = value;
			showConditionItem(containerEl, manager, config, disable);
		}).setDisabled(disable);
	showConditionItemInput(conditionDesc, config, disable);
}

function showConditionItemInput(containerEl: HTMLElement, config: SyncConfig, disable: boolean) {
	if (config.syncConditionType == SyncConditionType.CUSTOM_ITEM) {
		showCustomInputCount(containerEl, config, disable);
	}else if (config.syncConditionType == SyncConditionType.CUSTOM_TIME) {
		showCustomInputTime(containerEl, config, disable);
	}
}

function showCustomInputCount(containerEl: HTMLElement, config: SyncConfig, disable: boolean) {
	containerEl.createEl('span', { text: '   ' })
	containerEl.createEl('span', { text: i18nHelper.getMessage('110077') })
	containerEl.createEl('span', { text: i18nHelper.getMessage('110078') })
	const fromField = new TextComponent(containerEl);
	fromField.setPlaceholder(i18nHelper.getMessage('110080'))
		.setValue(config.syncConditionCountFromValue + '')
		.onChange(async (value) => {
			if (!value) {
				config.syncConditionCountFromValue = 1;
				return;
			}
			try {
				config.syncConditionCountFromValue = parseInt(value);
			}catch (e) {
				log.notice(i18nHelper.getMessage('112080'))
			}
		}).setDisabled(disable);
	let fromEl = fromField.inputEl;
	fromEl.addClass('obsidian_douban_settings_input')
	fromEl.style.width ='20%';
	containerEl.appendChild(fromEl);
	const lang = window.localStorage.getItem('language');
	if (lang == 'zh') {
		containerEl.createEl('span', {text: i18nHelper.getMessage('110073')})
	}

	containerEl.createEl('span', { text: i18nHelper.getMessage('110079') })
	containerEl.createEl('span', { text: i18nHelper.getMessage('110078') })
	const toField = new TextComponent(containerEl);
	toField.setPlaceholder(i18nHelper.getMessage('110080'))
		.setValue(config.syncConditionCountToValue + '')
		.onChange(async (value) => {
			if (!value) {
				config.syncConditionCountToValue = 30;
				return;
			}
			try {
				config.syncConditionCountToValue = parseInt(value);
			}catch (e) {
				log.notice(i18nHelper.getMessage('112080'))
			}
		}).setDisabled(disable);
	let toEl = toField.inputEl;
	toEl.addClass('obsidian_douban_settings_input')
	toEl.style.width ='20%';
	containerEl.appendChild(toEl);
	if (lang == 'zh') {
		containerEl.createEl('span', {text: i18nHelper.getMessage('110073')})
	}
	containerEl.createEl('span', {text: '  '})
	const buttopn = new ButtonComponent(containerEl).setIcon('help').setTooltip(i18nHelper.getMessage('110095'))
	containerEl.appendChild(buttopn.buttonEl);
}

function showCustomInputTime(containerEl: HTMLElement, config: SyncConfig, disable: boolean) {
	containerEl.createEl('span', { text: i18nHelper.getMessage('110077') })
	const fromDateField = new TextComponent(containerEl);
	const fromDateEl = fromDateField.inputEl;
	fromDateEl.type = 'date';
	fromDateEl.value = config.syncConditionDateFromValue ? config.syncConditionDateFromValue.toISOString().substring(0, 10) : TimeUtil.getLastMonth().toISOString().substring(0, 10);
	fromDateField.setPlaceholder(i18nHelper.getMessage('110075'))
		.setValue(config.syncConditionDateFromValue ? config.syncConditionDateFromValue.toISOString().substring(0, 10) : TimeUtil.getLastMonth().toISOString().substring(0, 10))
		.onChange(async (value) => {
			if (!value) {
				return;
			}
			try {
				config.syncConditionDateFromValue = new Date(value);
			}catch (e) {
				log.notice(i18nHelper.getMessage('110082'))
			}
		}).setDisabled(disable);
	fromDateEl.addClass('obsidian_douban_settings_input')
	containerEl.appendChild(fromDateEl);

	containerEl.createEl('span', { text: i18nHelper.getMessage('110079') })
	const toDateField = new TextComponent(containerEl);
	let toDateEl = toDateField.inputEl;
	toDateEl.type = 'date';
	toDateEl.value = config.syncConditionDateToValue ? config.syncConditionDateToValue.toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10);
	toDateField.setPlaceholder(i18nHelper.getMessage('110075'))
		.setValue(config.syncConditionDateToValue ? config.syncConditionDateToValue.toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10))
		.onChange(async (value) => {
			if (!value) {
				return;
			}
			try {
				config.syncConditionDateToValue = new Date(value);
			}catch (e) {
				log.notice(i18nHelper.getMessage('110082'))
			}
		}).setDisabled(disable);
	toDateEl.addClass('obsidian_douban_settings_input')
	containerEl.appendChild(toDateEl);
	new ButtonComponent(containerEl).setIcon('help').setTooltip(i18nHelper.getMessage('110095'))

}