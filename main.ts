import {Editor, Plugin} from "obsidian";

import {DoubanFuzzySuggester} from "src/douban/data/search/DoubanSearchFuzzySuggestModal";
import {DoubanSearchChooseItemHandler} from "src/douban/data/handler/DoubanSearchChooseItemHandler";
import {DoubanSearchModal} from "src/douban/data/search/DoubanSearchModal";
import {DoubanSettingTab} from "@App/setting/DoubanSettingTab";
import DoubanSubject from "src/douban/data/model/DoubanSubject";
import Searcher from "src/douban/data/search/Search";
import {i18nHelper} from './src/lang/helper';
import {log} from "src/utils/Logutil";
import {BasicConst, SearchHandleMode} from "./src/constant/Constsant";
import FileHandler from "./src/file/FileHandler";
import HandleContext from "@App/data/model/HandleContext";
import HandleResult from "@App/data/model/HandleResult";
import {FileUtil} from "./src/utils/FileUtil";
import { DoubanPluginSetting } from "@App/setting/model/DoubanPluginSetting";
import {DEFAULT_SETTINGS} from "./src/constant/DefaultSettings";

export default class DoubanPlugin extends Plugin {
	public settings: DoubanPluginSetting;
	public doubanExtractHandler: DoubanSearchChooseItemHandler;
	public doubanStatusBar: HTMLElement;
	public fileHandler: FileHandler;


	async putToObsidian(context: HandleContext, extract: DoubanSubject) {
		try {

			if (!extract) {
				log.warn(i18nHelper.getMessage('140101'));
				return;
			}
			this.showStatus('140204', extract.title);
			const result  = await this.doubanExtractHandler.parseText(extract, context)
			if (result) {
				this.putContentToObsidian(context, result);
			}
			this.showStatus('140205', extract.title);
		} catch (e) {
			this.showStatus('140206', e.message);
		} finally {
			this.clearStatusBarDelay();
		}
	}

	async putContentToObsidian(context: HandleContext, result: HandleResult) {
		const {mode} = context;
		switch (mode) {
			case SearchHandleMode.FOR_CREATE:
				this.createFile(context, result);
				break;
			case SearchHandleMode.FOR_REPLACE:
				this.putToEditor(context.editor, result.content);
				break;
		}
	}

	async putToEditor(editor: Editor, content: string) {
		editor.replaceSelection(content);
	}

	async createFile(context: HandleContext, result: HandleResult) {
		let filePath = this.settings.dataFilePath;
		filePath = filePath?filePath:DEFAULT_SETTINGS.dataFilePath;
		filePath = FileUtil.join(filePath, result.fileName);
		this.fileHandler.createNewNoteWithData(filePath, result.content);
	}

	async search(searchTerm: string, context: HandleContext) {
		try {
			this.showStatus('140201', searchTerm);
			const resultList = await Searcher.search(searchTerm, this.settings);
			this.showStatus('140202', resultList.length.toString());
			new DoubanFuzzySuggester(this, context).showSearchList(resultList);
		} catch (e) {
			this.showStatus('140206', e.message);
		} finally {
			this.clearStatusBarDelay();
		}
	}

	async getDoubanTextForActiveFile(context: HandleContext) {
		const activeFile = await this.app.workspace.getActiveFile();
		if (activeFile) {
			const searchTerm = activeFile.basename;
			if (searchTerm) {
				await this.search(searchTerm, context);
			}
		}
	}

	async getDoubanTextForCreateNewNote(context: HandleContext) {
		new DoubanSearchModal(this.app, this, context).open();
	}

	async getDoubanTextForSearchTerm(context: HandleContext) {
		new DoubanSearchModal(this.app, this, context).open();
	}

	async onload() {
		await this.loadSettings();
		if (this.settings.statusBar) {
			this.doubanStatusBar = this.addStatusBarItem();
		}

		this.addCommand({
			id: "search-douban-import-and-create-file",
			name: i18nHelper.getMessage("110101"),
			callback: () =>
				this.getDoubanTextForCreateNewNote({mode: SearchHandleMode.FOR_CREATE, settings: this.settings}),
		});

		this.addCommand({
			id: "search-douban-by-current-file-name",
			name: i18nHelper.getMessage("110001"),
			editorCallback: (editor: Editor) =>
				this.getDoubanTextForActiveFile({mode: SearchHandleMode.FOR_REPLACE, settings: this.settings, editor: editor}),
		});


		this.addCommand({
			id: "search-douban-and-input-current-file",
			name: i18nHelper.getMessage("110002"),
			editorCallback: (editor: Editor) =>
				this.getDoubanTextForSearchTerm({mode: SearchHandleMode.FOR_REPLACE, settings: this.settings, editor: editor}),
		});

		this.addSettingTab(new DoubanSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.doubanExtractHandler = new DoubanSearchChooseItemHandler(this.app, this);
		this.fileHandler = new FileHandler(this.app);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}





	showStatus(origin: string, message: string) {
		if (!this.settings.statusBar || !this.doubanStatusBar) {
			return;
		}
		this.doubanStatusBar.empty();
		// @ts-ignore
		this.doubanStatusBar.setText(i18nHelper.getMessage(origin).replace('{0}', message));
	}

	clearStatusBarDelay() {
		if (!this.settings.statusBar || !this.doubanStatusBar) {
			return;
		}
		setTimeout(() => this.doubanStatusBar.empty(), BasicConst.CLEAN_STATUS_BAR_DELAY)
	}
}

