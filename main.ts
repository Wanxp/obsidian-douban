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
import {BasicConst} from "./src/constant/Constsant";

export default class DoubanPlugin extends Plugin {
	public settings: DoubanPluginSettings;
	public doubanExtractHandler: DoubanSearchChooseItemHandler;
	public doubanStatusBar: HTMLElement;

	async putToEditor(editor:Editor, extract:DoubanSubject) {
		try {
			if (!editor || !extract) {
				log.warn(i18nHelper.getMessage('140101'));
				return;
			}
			this.showStatus('140204', extract.title);
			let content: string = this.doubanExtractHandler.parseText(extract, this.settings)
			if (content) {
				editor.replaceSelection(content);
			}
			this.showStatus('140205', extract.title);
		}catch (e) {
			this.showStatus('140206', e.message);
		}finally {
			setTimeout(() => this.doubanStatusBar.empty(), BasicConst.CLEAN_STATUS_BAR_DELAY)
		}
	}


	async search(searchTerm:string, editor: Editor) {
		try {
			this.showStatus('140201', searchTerm);
			const resultList = await Searcher.search(searchTerm, this.settings);
			this.showStatus('140202', resultList.length.toString());
			new DoubanFuzzySuggester(this, editor).showSearchList(resultList);
		}catch (e) {
			this.showStatus('140206', e.message);
		}finally {
			setTimeout(() => this.doubanStatusBar.empty(), BasicConst.CLEAN_STATUS_BAR_DELAY)
		}
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
  
	async getDoubanTextForSearchTerm(editor: Editor) {
	  new DoubanSearchModal(this.app, this, editor).open();
	}
  
	async onload() {
	  await this.loadSettings();

		this.doubanStatusBar = this.addStatusBarItem();

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
		  this.getDoubanTextForSearchTerm(editor),
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
	  this.doubanExtractHandler = new DoubanSearchChooseItemHandler(this.app, this);
	}
  
	async saveSettings() {
	  await this.saveData(this.settings);
	}

	showStatus(origin:string, message:string) {

		this.doubanStatusBar.empty();
		// @ts-ignore
		this.doubanStatusBar.setText(i18nHelper.getMessage(origin).replace('{0}', message));
	}
  }

