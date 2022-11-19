import {
	App,
	ButtonComponent,
	DropdownComponent,
	Modal,
	SliderComponent,
	TextComponent,
	ToggleComponent
} from "obsidian";

import DoubanPlugin from "main";
import {i18nHelper} from "src/lang/helper";
import HandleContext from "@App/data/model/HandleContext";
import {SyncType, SyncTypeRecords} from "../../constant/Constsant";
import {
	ALL,
	DoubanSubjectStateRecords_BOOK_SYNC, DoubanSubjectStateRecords_BROADCAST_SYNC,
	DoubanSubjectStateRecords_MOVIE_SYNC, DoubanSubjectStateRecords_NOTE_SYNC
} from "../../constant/DoubanUserState";
import {SyncConfig} from "@App/sync/model/SyncConfig";

export class DoubanSyncModal extends Modal {
	plugin: DoubanPlugin;
	context: HandleContext
	syncConfig: SyncConfig;

	constructor(app: App, plugin: DoubanPlugin, context: HandleContext) {
		super(app);
		this.plugin = plugin;
		this.context = context;
	}

	onOpen() {
		let {contentEl} = this;

		contentEl.createEl("h3", {text: i18nHelper.getMessage('500001')});


		this.syncConfig = {syncType: 'movie', scope: 'collect', force: false};

		const syncTypeDropdown = new DropdownComponent(contentEl);
		const scopeSelections = contentEl.createDiv("scope-selection");

		syncTypeDropdown.addOptions(SyncTypeRecords)
			.setValue(SyncType.movie)
			.onChange((value) => {
				this.syncConfig.syncType = value;
				this.openScopeDropdown(scopeSelections);
			});

		this.openScopeDropdown(scopeSelections);



		new ToggleComponent(contentEl)
			.setTooltip(i18nHelper.getMessage('500110'))
			.setValue(false)
			.onChange((value) => {
				this.syncConfig.force = value;
			});

		const controls = contentEl.createDiv("controls");
		// const syncButton = controls.createEl("button", {
		// 	text: i18nHelper.getMessage('110007'),
		// 	cls: "mod-cta",
		// 	attr: {
		// 		autofocus: true,
		// 	},
		// });

		const syncButton = new ButtonComponent(controls)
			.setButtonText(i18nHelper.getMessage('110007'))
			.onClick(async () => {
				this.close();
				await this.plugin.sync(this.syncConfig, this.context);
			})

		const cancelButton = new ButtonComponent(controls)
			.setButtonText(i18nHelper.getMessage('110005'))
			.onClick(() => {
				this.close();
			});
		cancelButton.setClass("obsidian_douban_search_button");
		syncButton.setClass("obsidian_douban_search_button");
	}


	async onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}

	private openScopeDropdown(contentEl:HTMLDivElement) {
		switch (this.syncConfig.syncType) {
			case SyncType.movie:
				this.showScopeDropdown(contentEl, DoubanSubjectStateRecords_MOVIE_SYNC);
				break;
			case SyncType.book:
				this.showScopeDropdown(contentEl, DoubanSubjectStateRecords_BOOK_SYNC);
				break;
			case SyncType.broadcast:
				this.showScopeDropdown(contentEl, DoubanSubjectStateRecords_BROADCAST_SYNC);
				break;
			case SyncType.note:
				this.showScopeDropdown(contentEl, DoubanSubjectStateRecords_NOTE_SYNC);
				break;
		}
	}

	private showScopeDropdown(contentEl:HTMLDivElement, scopeSelections: Record<string, string>) {
		contentEl.empty();
		const syncScopeTypeDropdown = new DropdownComponent(contentEl)
			.addOptions(scopeSelections)
			.setValue(ALL)
			.onChange((value) => {
				this.syncConfig.scope = value;
			});
	}
}
