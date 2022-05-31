import { App, Editor, Modal, TextComponent } from "obsidian";
import { log } from "utils/logutil";
import  DoubanPlugin  from "../main";

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

	  contentEl.createEl("h2", { text: "Enter Search Term:" });
  
	  const inputs = contentEl.createDiv("inputs");
	  const searchInput = new TextComponent(inputs).onChange((searchTerm) => {
		this.searchTerm = searchTerm;
	  });
	  searchInput.inputEl.focus();
	  searchInput.inputEl.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
		  this.search();
		}
	  });
	  


	  const controls = contentEl.createDiv("controls");
	  const searchButton = controls.createEl("button", {
		text: "Search",
		cls: "mod-cta",
		attr: {
		  autofocus: true,
		},
	  });
	  searchButton.addEventListener("click", this.close.bind(this));
	  const cancelButton = controls.createEl("button", { text: "Cancel" });
	  cancelButton.addEventListener("click", this.close.bind(this));
	}
	async search() {
		log.info("start search :" + this.searchTerm);
		let { contentEl } = this;
		contentEl.empty();
		if (this.searchTerm) {
			this.close();
			await this.plugin.search(this.searchTerm);
			// await this.plugin.pasteIntoEditor(this.editor, null);

		}
	}


  
	async onClose() {
	  let { contentEl } = this;
  
	  contentEl.empty();
	  if (this.searchTerm) {
		// await this.plugin.pasteIntoEditor(this.editor, this.searchTerm);
	  }
	}

  }