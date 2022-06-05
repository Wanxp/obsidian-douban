import { DEFAULT_SETTINGS, DoubanPluginSettings } from "./douban/Douban";
import { Editor, Plugin } from "obsidian";

import { DoubanEtractHandler } from "douban/handler/DoubanExtractHandler";
import { DoubanFuzzySuggester } from "douban/search/DoubanSearchFuzzySuggestModal";
import DoubanMovieSubject from "douban/model/DoubanMovieSubject";
import { DoubanSearchModal } from "douban/search/DoubanSearchModal";
import { DoubanSettingTab } from "douban/DoubanSettingTab";
import DoubanSubject from "douban/model/DoubanSubject";
import Searcher from "douban/search/Search";
import { i18nHelper } from './lang/helper';

export default class DoubanPlugin extends Plugin {
	public settings: DoubanPluginSettings;
	public doubanEtractHandler: DoubanEtractHandler;

	async putToEditor(editor:Editor, extract:DoubanSubject) {
		var content:string = this.doubanEtractHandler.parseText(this.settings.movieTemplate,
			 this.settings.arraySpilt, extract)
		if(content) {
			editor.replaceSelection(content);
		}
	}


	async search(searchTerm:string, editor: Editor) {
		const resultList = await Searcher.search(searchTerm, this.settings);
		new DoubanFuzzySuggester(this, editor).showSearchList(resultList);
	}

	async getDoubanMovieTextForActiveFile(editor: Editor) {
		const activeFile = await this.app.workspace.getActiveFile();
		if (activeFile) {
		  const searchTerm = activeFile.basename;
		  if (searchTerm) {
			await this.search(searchTerm, editor);
		  }
		}
	  }
  
	async geDoubanMovieTextForSearchTerm(editor: Editor) {
	  new DoubanSearchModal(this.app, this, editor).open();
	}
  
	async onload() {
	  await this.loadSettings();

	  this.addCommand({
		id: "search-douban-by-current-file-name",
		name: i18nHelper.getMessage("search douban by current file name"),
		editorCallback: (editor: Editor) =>
		  this.getDoubanMovieTextForActiveFile(editor),
	  });
  
  
	  this.addCommand({
		id: "search-douban-and-input-current-file",
		name: i18nHelper.getMessage("search douban and input current file"),
		editorCallback: (editor: Editor) =>
		  this.geDoubanMovieTextForSearchTerm(editor),
	  });
  
	  this.addSettingTab(new DoubanSettingTab(this.app, this));
	}
  
	async loadSettings() {
	  this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	  this.doubanEtractHandler = new DoubanEtractHandler(this.app, this);
	}
  
	async saveSettings() {
	  await this.saveData(this.settings);
	}
  }

