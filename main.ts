import { DoubanEtractHandler } from "douban/handler/DoubanExtractHandler";
import { DoubanSearchModal } from "douban/search/DoubanSearchModal";
import { DoubanSettingTab } from "douban/DoubanSettingTab";
import { DoubanFuzzySuggester } from "douban/search/DoubanSearchFuzzySuggestModal";
import { Editor, Notice, Plugin} from "obsidian";
import { log } from "utils/logutil";
import { DEFAULT_SETTINGS,  DoubanPluginSettings } from "./douban/Douban";
import DoubanSubject from "douban/model/DoubanSubject";
import DoubanSearchResultSubject from "douban/model/DoubanSearchResultSubject";
import Searcher from "douban/search/Search";

export default class DoubanPlugin extends Plugin {
	public settings: DoubanPluginSettings;
	public fuzzySuggester: DoubanFuzzySuggester;
	public doubanEtractHandler: DoubanEtractHandler;


	formatExtractText(extract: DoubanSubject): string {
	  return this.settings.template ? 
        this.settings.template.replace("{{id}}", extract.id)
        .replace("{{type}}", extract.type)
        .replace("{{title}}", extract.title)
        .replace("{{desc}}", extract.desc)
        .replace("{{url}}", extract.url) : "";
	}
  
	handleNotFound(searchTerm: string) {
	  log.error(`${searchTerm} not found on Wikipedia.`);
	}
  
	handleCouldntResolveDisambiguation() {
		log.error(`Could not automatically resolve disambiguation.`);
	}
  
	async getDoubanSearchList(title: string): Promise<DoubanSearchResultSubject[] | undefined> {
		return Searcher.search(title, this.settings);
	  }



	async pasteIntoEditor(editor: Editor, extract: DoubanSubject) {
	  if (!extract) {
		this.handleNotFound("Not Found Subject");
		return;
	  }
	  editor.replaceSelection(this.formatExtractText(extract));
	}


	async search(searchTerm:string) {
		log.info("plugin search :" + searchTerm);
		const resultListPromise = this.getDoubanSearchList(searchTerm);
		const resultList = await resultListPromise;
		// const result = this.parseSearchList(resultList);
		log.info("plugin search result:" + JSON.stringify(resultList));
		this.fuzzySuggester.showSearchList(resultList);
	}

	async getDoubanMovieTextForActiveFile(editor: Editor) {
		const activeFile = await this.app.workspace.getActiveFile();
		if (activeFile) {
		  const searchTerm = activeFile.basename;
		  if (searchTerm) {
			await this.search(searchTerm);
		  }
		}
	  }
  
	async geDoubanMovieTextForSearchTerm(editor: Editor) {
		log.info("start  open search windows");
	  new DoubanSearchModal(this.app, this, editor).open();
	}
  
	async onload() {
	  await this.loadSettings();

	  this.addCommand({
		id: "douban-movie-for-current-file",
		name: "get dou ban movie",
		editorCallback: (editor: Editor) =>
		  this.getDoubanMovieTextForActiveFile(editor),
	  });
  
  
	  this.addCommand({
		id: "douban-movie-for-search",
		name: "douban-movie-for-search",
		editorCallback: (editor: Editor) =>
		  this.geDoubanMovieTextForSearchTerm(editor),
	  });
  
	  this.addSettingTab(new DoubanSettingTab(this.app, this));
	  this.fuzzySuggester = new DoubanFuzzySuggester(this.app, this);
	  this.doubanEtractHandler = new DoubanEtractHandler(this.app, this);
	}
  
	async loadSettings() {
	  this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}
  
	async saveSettings() {
	  await this.saveData(this.settings);
	}
  }

