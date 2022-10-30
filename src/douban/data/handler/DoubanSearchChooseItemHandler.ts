import {App, Editor} from "obsidian";

import DoubanBookLoadHandler from "./DoubanBookLoadHandler";
import DoubanMovieLoadHandler from "./DoubanMovieLoadHandler";
import DoubanMusicLoadHandler from "./DoubanMusicLoadHandler";
import DoubanNoteLoadHandler from "./DoubanNoteLoadHandler";
import DoubanOtherLoadHandler from "./DoubanOtherLoadHandler";
import DoubanPlugin from "main";
import {DoubanPluginSettings} from "src/douban/Douban";
import DoubanSubject from "../model/DoubanSubject";
import DoubanSubjectLoadHandler from "./DoubanSubjectLoadHandler";
import {DoubanTeleplayLoadHandler} from "./DoubanTeleplayLoadHandler";
import DoubanGameLoadHandler from "./DoubanGameLoadHandler";

export class DoubanSearchChooseItemHandler {

	private _app: App;
	private _doubanPlugin: DoubanPlugin;
	private _doubanSubjectHandlers: DoubanSubjectLoadHandler<DoubanSubject>[];
	private _doubanSubjectHandlerDefault: DoubanSubjectLoadHandler<DoubanSubject>;


	constructor(app: App, doubanPlugin: DoubanPlugin) {
		this._app = app;
		this._doubanPlugin = doubanPlugin;
		this._doubanSubjectHandlerDefault = new DoubanOtherLoadHandler(doubanPlugin);
		this._doubanSubjectHandlers = [new DoubanMovieLoadHandler(doubanPlugin), new DoubanBookLoadHandler(doubanPlugin),
			new DoubanTeleplayLoadHandler(doubanPlugin),
			new DoubanMusicLoadHandler(doubanPlugin),
			new DoubanNoteLoadHandler(doubanPlugin),
			new DoubanGameLoadHandler(doubanPlugin),

			this._doubanSubjectHandlerDefault];
	}

	public handle(searchExtract: DoubanSubject, editor: Editor): void {
		if (!searchExtract) {
			return;
		}
		let doubanSubjectHandlers: DoubanSubjectLoadHandler<DoubanSubject>[] = this._doubanSubjectHandlers
			.filter(h => h.support(searchExtract));
		if (doubanSubjectHandlers && doubanSubjectHandlers.length > 0) {
			doubanSubjectHandlers[0].handle(searchExtract.url, editor);
		} else {
			this._doubanSubjectHandlerDefault.handle(searchExtract.url, editor);
		}
	}

	public parseText(extract: DoubanSubject, settings: DoubanPluginSettings): string {
		if (!settings) {
			return "";
		}
		let doubanSubjectHandlers: DoubanSubjectLoadHandler<DoubanSubject>[] = this._doubanSubjectHandlers
			.filter(h => h.support(extract));
		if (doubanSubjectHandlers && doubanSubjectHandlers.length > 0) {
			let result = doubanSubjectHandlers.map(h => h.parse(extract, settings));
			if (result && result.length > 0) {
				return result[0];
			} else {
				return "";
			}
		} else {
			return this._doubanSubjectHandlerDefault.parse(extract, settings);
		}

	}

}

