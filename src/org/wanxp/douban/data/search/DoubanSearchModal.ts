import {App, DropdownComponent, Modal, TextComponent} from "obsidian";

import DoubanPlugin from "../../../main";
import {i18nHelper} from "src/org/wanxp/lang/helper";
import HandleContext from "../model/HandleContext";
import {SearchTypeRecords, SupportType} from "../../../constant/Constsant";

export class DoubanSearchModal extends Modal {
	searchTerm: string;
	searchType: SupportType = SupportType.ALL;
	plugin: DoubanPlugin;
	context: HandleContext

	constructor(app: App, plugin: DoubanPlugin, context: HandleContext) {
		super(app);
		this.plugin = plugin;
		this.context = context;
	}

	onOpen() {
		let {contentEl} = this;

		contentEl.createEl("h3", {text: i18nHelper.getMessage('110003')});
		const content = contentEl.createDiv("content");

		const typeSelect = content.createDiv("type-select");
		const typeSelectInput = new DropdownComponent(typeSelect)
			.addOptions(SearchTypeRecords)
			.setValue(SupportType.ALL)
			.onChange((value:SupportType) => {
			this.searchType = value;
		});
		typeSelect.addClass('obsidian_douban_search_input');


		const inputs = content.createDiv("inputs");
		const searchInput = new TextComponent(inputs).onChange((searchTerm) => {
			this.searchTerm = searchTerm;
		});
		inputs.addClass("obsidian_douban_search_input");
		searchInput.inputEl.size = 40;

		searchInput.inputEl.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				this.close();
			}
		});





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
		searchInput.inputEl.focus();

	}


	async onClose() {
		let {contentEl} = this;
		contentEl.empty();
		if (this.searchTerm) {
			await this.plugin.search(this.searchTerm, this.searchType, this.context);
		}
	}

}
