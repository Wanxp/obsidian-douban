import {App, DropdownComponent, Modal, TextComponent} from "obsidian";

import DoubanPlugin from "main";
import {i18nHelper} from "src/lang/helper";
import HandleContext from "@App/data/model/HandleContext";

export class DoubanSearchModal extends Modal {
	searchTerm: string;
	plugin: DoubanPlugin;
	context: HandleContext

	constructor(app: App, plugin: DoubanPlugin, context: HandleContext) {
		super(app);
		this.plugin = plugin;
		this.context = context;
	}

	onOpen() {
		let {contentEl} = this;

		contentEl.createEl("h3", {text: i18nHelper.getMessage('500001')});

		const inputs = contentEl.createDiv("inputs");

		// const syncTypeDropdown = new DropdownComponent(contentEl)
		// 	.addOptions();




		const controls = contentEl.createDiv("controls");
		const searchButton = controls.createEl("button", {
			text: i18nHelper.getMessage('110004'),
			cls: "mod-cta",
			attr: {
				autofocus: true,
			},
		});
		searchButton.addClass("obsidian_douban_search_button");

		searchButton.addEventListener("click", this.close.bind(this));
		const cancelButton = controls.createEl("button", {text: i18nHelper.getMessage('110005')});
		cancelButton.addEventListener("click", this.close.bind(this));
		cancelButton.addClass("obsidian_douban_search_button");

	}


	async onClose() {
		let {contentEl} = this;
		contentEl.empty();
		if (this.searchTerm) {
			await this.plugin.search(this.searchTerm, this.context);
		}
	}

}
