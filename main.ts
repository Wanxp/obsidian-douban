import { DEFAULT_SETTINGS, DoubanPluginSettings } from "./src/douban/Douban";
import { Editor, Plugin } from "obsidian";

import { DoubanFuzzySuggester } from "src/douban/data/search/DoubanSearchFuzzySuggestModal";
import { DoubanSearchChooseItemHandler } from "src/douban/data/handler/DoubanSearchChooseItemHandler";
import { DoubanSearchModal } from "src/douban/data/search/DoubanSearchModal";
import { DoubanSettingTab } from "src/douban/DoubanSettingTab";
import DoubanSubject from "src/douban/data/model/DoubanSubject";
import Searcher from "src/douban/data/search/Search";
import { i18nHelper } from './src/lang/helper';
import { log } from "src/utils/Logutil";

export default class DoubanPlugin extends Plugin {
	public settings: DoubanPluginSettings;
	public doubanEtractHandler: DoubanSearchChooseItemHandler;

	async putToEditor(editor:Editor, extract:DoubanSubject) {
		if(!editor || !extract) {
			log.warn(i18nHelper.getMessage('140101'));
			return;
		}
		let content:string = this.doubanEtractHandler.parseText(extract, this.settings)
		if(content) {
			editor.replaceSelection(content);
		}
	}


	async search(searchTerm:string, editor: Editor) {
		const resultList = await Searcher.search(searchTerm, this.settings);
		new DoubanFuzzySuggester(this, editor).showSearchList(resultList);
	}

	async getDoubanTextForActiveFile(editor: Editor) {
		const activeFile = await this.app.workspace.getActiveFile();
		if (activeFile) {
		  const searchTerm = activeFile.basename;
		  if (searchTerm) {
			await this.search(searchTerm, editor);
		  }
		}
	  }
  
	async geDoubanTextForSearchTerm(editor: Editor) {
	  new DoubanSearchModal(this.app, this, editor).open();
	}
  
	async onload() {
	  await this.loadSettings();

	  this.addCommand({
		id: "search-douban-by-current-file-name",
		name: i18nHelper.getMessage("110001"),
		editorCallback: (editor: Editor) =>
		  this.getDoubanTextForActiveFile(editor),
	  });
  
  
	  this.addCommand({
		id: "search-douban-and-input-current-file",
		name: i18nHelper.getMessage("110002"),
		editorCallback: (editor: Editor) =>
		  this.geDoubanTextForSearchTerm(editor),
	  });
//TODO will support in future
	  // this.addCommand({
		// id: "sync-douban-broadcast-by-user-id",
		// name: i18nHelper.getMessage('110006'),
		// editorCallback: (editor: Editor) =>
		//   this.geDoubanTextForSearchTerm(editor),
	  // });
  
	  this.addSettingTab(new DoubanSettingTab(this.app, this));
	}
  
	async loadSettings() {
	  this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	  this.doubanEtractHandler = new DoubanSearchChooseItemHandler(this.app, this);
	}
  
	async saveSettings() {
	  await this.saveData(this.settings);
	}
  }

