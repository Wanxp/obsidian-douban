import { App, Editor, Modal, TextComponent } from "obsidian";

import  DoubanPlugin  from "../../main";
import { i18nHelper } from "lang/helper";
import { log } from "utils/Logutil";

export class DoubanSearchModal extends Modal {
	searchTerm: string;
	plugin: DoubanPlugin;
	editor: Editor;
  
	constructor(app: App, plugin: DoubanPlugin, editor: Editor) {
	  super(app);
	  this.plugin = plugin;
	  this.editor = editor;
	}
  
	onOpen() {
	  let { contentEl } = this;

	  contentEl.createEl("h2", { text: i18nHelper.getMessage('Enter Search Term:') });
  
	  const inputs = contentEl.createDiv("inputs");
	  const searchInput = new TextComponent(inputs).onChange((searchTerm) => {
		this.searchTerm = searchTerm;
	  });
	  searchInput.inputEl.addClass("search_input");

	  searchInput.inputEl.focus();
	  searchInput.inputEl.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
		  this.close();
		}
	  });
	  


	  const controls = contentEl.createDiv("controls");
	  const searchButton = controls.createEl("button", {
		text: i18nHelper.getMessage('Search'),
		cls: "mod-cta",
		attr: {
		  autofocus: true,
		},
	  });
	  searchButton.addClass("search_button");

	  searchButton.addEventListener("click", this.close.bind(this));
	  const cancelButton = controls.createEl("button", { text:  i18nHelper.getMessage('Cancel') });
	  cancelButton.addEventListener("click", this.close.bind(this));
	  cancelButton.addClass("search_button");

	}

  
	async onClose() {
	  let { contentEl } = this;
  
	  contentEl.empty();
	  if (this.searchTerm) {
		await this.plugin.search(this.searchTerm, this.editor);
	}
	}

  }