import {
	App,
	ButtonComponent,
	Modal, SearchComponent, Setting,
} from "obsidian";

import DoubanPlugin from "../../main";
import {i18nHelper} from "src/org/wanxp/lang/helper";
import HandleContext from "../data/model/HandleContext";
import {SyncType, SyncTypeRecords} from "../../constant/Constsant";
import {
	ALL,
	DoubanSubjectStateRecords_BOOK_SYNC, DoubanSubjectStateRecords_BROADCAST_SYNC,
	DoubanSubjectStateRecords_MOVIE_SYNC, DoubanSubjectStateRecords_MUSIC_SYNC, DoubanSubjectStateRecords_NOTE_SYNC
} from "../../constant/DoubanUserState";
import {SyncConfig} from "../sync/model/SyncConfig";
import {clearInterval} from "timers";
import {FolderSuggest} from "../setting/model/FolderSuggest";
import {DEFAULT_SETTINGS} from "../../constant/DefaultSettings";

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

		this.showConfigPan(contentEl, syncConfig, true);

		const sliderDiv = contentEl.createEl('div');
		sliderDiv.addClass('obsidian_douban_sync_slider');
		const controls = contentEl.createDiv("controls");

		const syncButton = new ButtonComponent(controls)
			.setButtonText(i18nHelper.getMessage('110009'))
			.onClick(async () => {
				this.close();
				await this.plugin.statusHolder.stopSync();
			})

		const cancelButton = new ButtonComponent(controls)
			.setButtonText(i18nHelper.getMessage('110010'))
			.onClick(() => {
				this.close();
			});
		cancelButton.setClass("obsidian_douban_search_button");
		syncButton.setClass("obsidian_douban_search_button");
		this.showProgress(sliderDiv, syncButton);

		this.timer = setInterval(() => {
			this.showProgress(sliderDiv,syncButton);
		}, 1000);
	}


	private showProgress(sliderDiv: HTMLDivElement, button:ButtonComponent) {
		const {syncStatus} = this.plugin.statusHolder;
		if (!this.plugin.statusHolder.syncStarted) {
			sliderDiv.innerHTML = `<p>
    <label for="file">${i18nHelper.getMessage('110033')}</label>
    <progress class="obsidian_douban_sync_slider" max="${syncStatus.getTotal()}" value="${syncStatus.getHandle()}"> </progress> <span> ${syncStatus.getHandle()}/${syncStatus.getTotal()}:${i18nHelper.getMessage('110036')} </span>
</p>`
			button.setDisabled(true);
			return;
		}
		sliderDiv.innerHTML = `<p>
    <label for="file">${i18nHelper.getMessage('110033')}</label>
    <progress class="obsidian_douban_sync_slider" max="${syncStatus.getTotal()}" value="${syncStatus.getHandle()}"> </progress> <span> ${syncStatus.getHandle()}/${syncStatus.getTotal()} </span>
</p>`}

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
			attachmentPath: (settings.attachmentPath == '' || settings.attachmentPath == null) ?  DEFAULT_SETTINGS.attachmentPath : settings.attachmentPath,
		};
		this.showConfigPan(contentEl, syncConfig, false);
		const controls = contentEl.createDiv("controls");

		const syncButton = new ButtonComponent(controls)
			.setButtonText(i18nHelper.getMessage('110007'))
			.onClick(async () => {
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

		const cancelButton = new ButtonComponent(controls)
			.setButtonText(i18nHelper.getMessage('110005'))
			.onClick(() => {
				this.close();
			});
		cancelButton.setClass("obsidian_douban_search_button");
		syncButton.setClass("obsidian_douban_search_button");
	}

	private updateContextByConfig(syncConfig: SyncConfig) {
		const { context} = this;
		context.syncConfig = syncConfig;
	}

	private showConfigPan(contentEl: HTMLElement, config:SyncConfig, disable:boolean) {
		const typeSelections = contentEl.createDiv('type-selection');
		const folderSelections = contentEl.createDiv('folder-selection');
		const fileName = contentEl.createDiv('fileName-item');
		const attachments = contentEl.createDiv('attachments-item');
		const forceSelections = contentEl.createDiv('force-selection');
		this.showTypeDropdown(typeSelections, config, disable);
		this.showOutputFolderSelections(folderSelections, config, disable);
		this.showOutiFleName(fileName, config, disable);
		this.showAttachmentsFileConfig(attachments, config, disable);
		this.showForceUpdateConfig(forceSelections, config, disable);
	}

	async onClose() {
		let {contentEl} = this;
		contentEl.empty();
		if (this.timer != null) {
			clearInterval(this.timer);
		}
	}

	private openScopeDropdown(contentEl:HTMLDivElement, config: SyncConfig, disable:boolean) {
		contentEl.empty();
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
		}
	}

	private showTypeDropdown(containerEl:HTMLDivElement, config: SyncConfig, disable:boolean) {
		containerEl.empty();
		const settings = new Setting(containerEl);
		settings
			.setName(i18nHelper.getMessage('110030'))
			.addDropdown((dropdown) => {
				dropdown.addOptions(SyncTypeRecords)
					.setValue(config.syncType)
					.onChange((value) => {
						config.syncType = value;
						this.showTypeDropdown(containerEl, config, disable);
					});
			}).setDisabled(disable);
		const scopeSelections = containerEl.createDiv("scope-selection");
		this.openScopeDropdown(scopeSelections, config, disable);
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

	private  showOutiFleName(containerEl: HTMLElement, config: SyncConfig, disable:boolean) {
		containerEl.empty();
		const {settings} =  this.plugin;
		const placeHolder =(settings.dataFileNamePath == '' || settings.dataFileNamePath == null) ?  DEFAULT_SETTINGS.dataFileNamePath : settings.dataFileNamePath;
		containerEl.empty();
		const dataFilePathSetting = new Setting(containerEl)
			.setName(i18nHelper.getMessage('121601'))
			.setDesc(i18nHelper.getMessage('121602'))
			.addText((textField) => {
				textField.setPlaceholder(placeHolder)
					.setValue(config.dataFileNamePath)
					.onChange(async (value) => {
						config.dataFileNamePath = value
					});
			})
			.setDisabled(disable);
		dataFilePathSetting.addExtraButton((button) => {
			button
				.setIcon('reset')
				.setTooltip(i18nHelper.getMessage('121902'))
				.onClick(async () => {
					config.dataFileNamePath = placeHolder
					this.showOutiFleName(containerEl, config, disable);
				});
		})
	}

	showOutputFolderSelections(containerEl: HTMLElement, config: SyncConfig, disable:boolean) {
		containerEl.empty();
		const placeHolder:string = this.plugin.settings.dataFilePath ? this.plugin.settings.dataFilePath : DEFAULT_SETTINGS.dataFilePath;
		new Setting(containerEl)
			.setName( i18nHelper.getMessage('121501'))
			.setDesc( i18nHelper.getMessage('121502'))
			.addSearch(async (search: SearchComponent) => {
				new FolderSuggest(this.app, search.inputEl);
				// @ts-ignore
				search.setValue(config.dataFilePath)
					// @ts-ignore
					.setPlaceholder(placeHolder)
					.onChange(async (value: string) => {
						config.dataFilePath = value;
					});
			})
			.setDisabled(disable);
	}


	showForceUpdateConfig(containerEl: HTMLElement, config: SyncConfig, disable:boolean) {
		containerEl.empty();
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
		containerEl.empty();
		new Setting(containerEl)
			.setName(i18nHelper.getMessage('121430'))
			.setDesc(i18nHelper.getMessage('121431'))
			.addToggle((toggleComponent) => {
				toggleComponent
					// .setTooltip(i18nHelper.getMessage('121403'))
					.setValue(config.cacheImage)
					.onChange(async (value) => {
						config.cacheImage = value;
						this.showAttachmentsFileConfig(containerEl, config, disable);
					});
			})
			.setDisabled(disable);
		if(config.cacheImage) {
			this.showAttachmentPathSelections(containerEl, config, disable);
		}
	}

	showAttachmentPathSelections(containerEl: HTMLElement, config: SyncConfig, disable:boolean) {
		const placeHolder:string = this.plugin.settings.attachmentPath ? this.plugin.settings.attachmentPath : DEFAULT_SETTINGS.attachmentPath;
		new Setting(containerEl)
			.setName( i18nHelper.getMessage('121432'))
			.setDesc( i18nHelper.getMessage('121433'))
			.addSearch(async (search: SearchComponent) => {
				new FolderSuggest(this.plugin.app, search.inputEl);
				// @ts-ignore
				search.setValue(config.attachmentPath)
					// @ts-ignore
					.setPlaceholder(placeHolder)
					.onChange(async (value: string) => {
						config.attachmentPath = value;
					});
			})
			.setDisabled(disable);
	}

}
