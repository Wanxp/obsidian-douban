import {App} from "obsidian";

import DoubanBookLoadHandler from "./DoubanBookLoadHandler";
import DoubanMovieLoadHandler from "./DoubanMovieLoadHandler";
import DoubanMusicLoadHandler from "./DoubanMusicLoadHandler";
import DoubanNoteLoadHandler from "./DoubanNoteLoadHandler";
import DoubanOtherLoadHandler from "./DoubanOtherLoadHandler";
import DoubanPlugin from "../../../main";
import DoubanSubject from "../model/DoubanSubject";
import DoubanSubjectLoadHandler from "./DoubanSubjectLoadHandler";
import {DoubanTeleplayLoadHandler} from "./DoubanTeleplayLoadHandler";
import DoubanGameLoadHandler from "./DoubanGameLoadHandler";
import HandleContext from "../model/HandleContext";
import HandleResult from "../model/HandleResult";
import DoubanTheaterLoadHandler from "./DoubanTheaterLoadHandler";

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
			new DoubanTheaterLoadHandler(doubanPlugin),
			this._doubanSubjectHandlerDefault];
	}

	public async handle(searchExtract: DoubanSubject, context: HandleContext): Promise<void> {
		if (!searchExtract) {
			return;
		}
		let doubanSubjectHandlers: DoubanSubjectLoadHandler<DoubanSubject>[] = this._doubanSubjectHandlers
			.filter(h => h.support(searchExtract));
		if (doubanSubjectHandlers && doubanSubjectHandlers.length > 0) {
			await doubanSubjectHandlers[0].handle(searchExtract.url, context);
		} else {
			await this._doubanSubjectHandlerDefault.handle(searchExtract.url, context);
		}
	}

	public async parseText(extract: DoubanSubject, context: HandleContext): Promise<HandleResult> {
		let doubanSubjectHandlers: DoubanSubjectLoadHandler<DoubanSubject>[] = this._doubanSubjectHandlers
			.filter(h => h.support(extract));
		let result:string='';
		if (doubanSubjectHandlers && doubanSubjectHandlers.length > 0) {
			let result = await doubanSubjectHandlers.map(h => h.parse(extract, context));
			if (result && result.length > 0) {
				return result[0];
			} else {
				return {content: ''};
			}
		} else {
			return this._doubanSubjectHandlerDefault.parse(extract, context);
		}

	}

}

