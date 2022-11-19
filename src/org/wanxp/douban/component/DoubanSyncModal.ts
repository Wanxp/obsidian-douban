import {
	App,
	ButtonComponent,
	DropdownComponent,
	Modal, SearchComponent, Setting,
	TextComponent,
	ToggleComponent
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
import {statSync} from "fs";
import {CreateTemplateSelectParams} from "../setting/model/CreateTemplateSelectParams";
import {FolderSuggest} from "../setting/model/FolderSuggest";
import SettingsManager from "../setting/SettingsManager";
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
			outputFolder: (settings.dataFilePath == '' || settings.dataFilePath == null) ? DEFAULT_SETTINGS.dataFilePath : settings.dataFilePath,
			dataFileNamePath: (settings.dataFileNamePath == '' || settings.dataFileNamePath == null) ?  DEFAULT_SETTINGS.dataFileNamePath : settings.dataFileNamePath};
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
				this.show(contentEl);
				await this.plugin.sync(syncConfig, this.context);
			})

		const cancelButton = new ButtonComponent(controls)
			.setButtonText(i18nHelper.getMessage('110005'))
			.onClick(() => {
				this.close();
			});
		cancelButton.setClass("obsidian_douban_search_button");
		syncButton.setClass("obsidian_douban_search_button");
	}

	private showConfigPan(contentEl: HTMLElement, config:SyncConfig, disable:boolean) {
		const typeSelections = contentEl.createDiv('type-selection');
		const typeSelectionLabel = typeSelections.createEl('label');
		typeSelectionLabel.setText(i18nHelper.getMessage('110030'))
		typeSelectionLabel.addClass('obsidian_douban_settings_text')
		const syncTypeDropdown = new DropdownComponent(typeSelections);
		const scopeSelections = contentEl.createDiv("scope-selection");
		syncTypeDropdown.addOptions(SyncTypeRecords)
			.setValue(config.syncType)
			.onChange((value) => {
				config.syncType = value;
				this.openScopeDropdown(scopeSelections, config, disable);
			});

		this.openScopeDropdown(scopeSelections, config, disable);

		const forceSelections = contentEl.createDiv('force-selection');
		let forceLabel = forceSelections.createEl('label');
		forceLabel.setText(i18nHelper.getMessage('110031'));
		forceLabel.addClass('obsidian_douban_settings_text');
		forceLabel.addClass('obsidian_douban_sync_config_text');
		const toggle:ToggleComponent = new ToggleComponent(forceSelections)
			.setTooltip(i18nHelper.getMessage('500110'))
			.setValue(config.force)
			.onChange((value) => {
				config.force = value;
			});
		if (disable) {
			syncTypeDropdown.setDisabled(true);
			toggle.setDisabled(true);
		}
		const folderSelections = contentEl.createDiv('folder-selection');
		let folderLabel = folderSelections.createEl('label');
		folderLabel.setText(i18nHelper.getMessage('110034'));
		folderLabel.addClass('obsidian_douban_settings_text');
		folderLabel.addClass('obsidian_douban_sync_config_text');
		this.createFolderSetting(folderSelections, config, disable);

		const fileName = contentEl.createDiv('fileName-item');
		let fileNameLabel = fileName.createEl('label');
		fileNameLabel.setText(i18nHelper.getMessage('110035'));
		fileNameLabel.addClass('obsidian_douban_settings_text');
		fileNameLabel.addClass('obsidian_douban_sync_config_text');
		fileNameLabel.addClass('obsidian_douban_sync_config');
		this.constructOutiFleName(fileName, config, disable);

		fileName.addClass('obsidian_douban_sync_config');
		folderSelections.addClass('obsidian_douban_sync_config');
		typeSelections.addClass('obsidian_douban_sync_config');
		scopeSelections.addClass('obsidian_douban_sync_config');
		forceSelections.addClass('obsidian_douban_sync_config');
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
		let scopeLabel = contentEl.createEl('label');
		scopeLabel.addClass('obsidian_douban_settings_text');
		scopeLabel.setText(i18nHelper.getMessage('110032'));
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

	private showScopeDropdown(contentEl:HTMLDivElement, scopeSelections: Record<string, string>, config: SyncConfig, disable:boolean) {
		const syncScopeTypeDropdown = new DropdownComponent(contentEl)
			.addOptions(scopeSelections)
			.setValue(config.scope)
			.onChange((value) => {
				config.scope = value;
			});
		if (disable) {
			syncScopeTypeDropdown.setDisabled(true);
		}
	}

	 private createFolderSetting(contentEl:HTMLDivElement, config: SyncConfig, disable:boolean) {
		 const {settings} =  this.plugin;
		 const placeHolder =  (settings.dataFilePath == '' || settings.dataFilePath == null) ? DEFAULT_SETTINGS.dataFilePath : settings.dataFilePath;
		 let outputFolder = placeHolder;
		 if (config.outputFolder) {
			 outputFolder = config.outputFolder;
		 }
		 const search = new TextComponent(contentEl);
		 new FolderSuggest(this.plugin.app, search.inputEl);
		 search.setValue(outputFolder)
			 .setPlaceholder(placeHolder)
			 .onChange(async (value:string) => {
				 config.outputFolder = value;
			 })
		 if (disable) {
			 search.setDisabled(true);
		 }
	}

	private  constructOutiFleName(containerEl: HTMLElement, config: SyncConfig, disable:boolean) {
		const {settings} =  this.plugin;
		const placeHolder =(settings.dataFileNamePath == '' || settings.dataFileNamePath == null) ?  DEFAULT_SETTINGS.dataFileNamePath : settings.dataFileNamePath;
		let dataFileNamePath = placeHolder;
		if (config.dataFileNamePath) {
			dataFileNamePath = config.dataFileNamePath;
		}
		const textComponent = new TextComponent(containerEl);
		textComponent.setPlaceholder(placeHolder)
					.setValue(dataFileNamePath)
					.onChange(async (value) => {
						config.dataFileNamePath = value;
					});
		if (disable) {
			textComponent.setDisabled(true);
		}
	}

}
