import { DoubanSearchModal } from "douban/DoubanSearchModal";
import { DoubanSettingTab } from "douban/DoubanSettingTab";
import { DoubanFuzzySuggester } from "douban/search/DoubanSearchFuzzySuggestModal";
import { Editor, Notice, Plugin} from "obsidian";
import { log } from "utils/logutil";
import { DEFAULT_SETTINGS, DoubanExtract, DoubanPluginSettings } from "./douban/Douban";
import { Searcher } from "./douban/search/Search";
import { DoubanSearchResultExtract } from "./douban/search/SearchParser";

export default class DoubanPlugin extends Plugin {
	public settings: DoubanPluginSettings;
	public fuzzySuggester: DoubanFuzzySuggester;


	formatExtractText(extract: DoubanExtract): string {
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
  
  
	parseSearchList(extract: DoubanSearchResultExtract[]):DoubanSearchResultExtract[] {
		// return extract.map(result => {
		// 	return {
		// 	id: result.id,
		// 	type: result.type,
		// 	title: result.title,
		// 	desc: result.desc,
		// 	url: result.url,
		// 	score: result.score,
		// 	cast: result.cast
		// 	}
		// })
		return extract;
	}
  
	async getDoubanSearchList(title: string): Promise<DoubanSearchResultExtract[] | undefined> {
		return Searcher.search(title, this.settings);
	  }

	async getDoubanMovieText(title: DoubanSearchResultExtract): Promise<DoubanExtract | undefined> {
	//   const moviesPromise =  search(title);
	//   const movies = await moviesPromise;
	//   const extract = this.parseResponse(movies);
	  return null;
	}
  


	async pasteIntoEditor(editor: Editor, extract: DoubanExtract) {

	  if (!extract) {
		this.handleNotFound("Not Found Subject");
		return;
	  }
	  editor.replaceSelection(this.formatExtractText(extract));
	}


	async search(searchTerm:string) {
		log.info("plugin search :" + searchTerm);
		const resultListPromise = this.getDoubanSearchList(searchTerm);
		resultListPromise.then(log.info);
		const resultList = await resultListPromise;
		const result = this.parseSearchList(resultList);
		log.info("plugin search result:" + JSON.stringify(result));
		this.fuzzySuggester.showSearchList(result);
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
	}
  
	async loadSettings() {
	  this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}
  
	async saveSettings() {
	  await this.saveData(this.settings);
	}
  }

