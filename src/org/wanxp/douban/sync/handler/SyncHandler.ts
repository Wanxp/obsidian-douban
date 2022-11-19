import HandleContext from "../../data/model/HandleContext";
import {SyncConfig} from "../model/SyncConfig";
import DoubanPlugin from "../../../main";
import {App} from "obsidian";
import {DoubanSyncHandler} from "./DoubanSyncHandler";
import DoubanOtherLoadHandler from "../../data/handler/DoubanOtherLoadHandler";
import DoubanMovieLoadHandler from "../../data/handler/DoubanMovieLoadHandler";
import DoubanBookLoadHandler from "../../data/handler/DoubanBookLoadHandler";
import {DoubanTeleplayLoadHandler} from "../../data/handler/DoubanTeleplayLoadHandler";
import DoubanMusicLoadHandler from "../../data/handler/DoubanMusicLoadHandler";
import DoubanNoteLoadHandler from "../../data/handler/DoubanNoteLoadHandler";
import DoubanGameLoadHandler from "../../data/handler/DoubanGameLoadHandler";
import { DoubanBroadcastSyncHandler } from "./DoubanBroadcastSyncHandler";
import {DoubanOtherSyncHandler} from "./DoubanOtherSyncHandler";
import { DoubanMovieSyncHandler } from "./DoubanMovieSyncHandler";
import { DoubanNoteSyncHandler } from "./DoubanNoteSyncHandler";
import { DoubanMusicSyncHandler } from "./DoubanMusicSyncHandler";
import { DoubanBookSyncHandler } from "./DoubanBookSyncHandler";
import DoubanSubjectLoadHandler from "../../data/handler/DoubanSubjectLoadHandler";
import DoubanSubject from "../../data/model/DoubanSubject";
import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";

export default class SyncHandler {
	private app: App;
	private plugin: DoubanPlugin;
	private syncConfig: SyncConfig;
	private context: HandleContext;
	private syncHandlers: DoubanSyncHandler[];
	private defaultSyncHandler: DoubanSyncHandler;

	 constructor(app: App, plugin: DoubanPlugin, syncConfig: SyncConfig, context: HandleContext) {
		this.app = app;
		this.plugin = plugin;
		this.syncConfig = syncConfig;
		this.context = context;
		this.defaultSyncHandler = new DoubanOtherSyncHandler(plugin);
		this.syncHandlers =
			 [
				 new DoubanMovieSyncHandler(plugin),
				 new DoubanBookSyncHandler(plugin),
				 // new DoubanBroadcastSyncHandler(plugin),
				 // new DoubanNoteSyncHandler(plugin),
				 new DoubanMusicSyncHandler(plugin),
				 this.defaultSyncHandler
			 ];
	 }

	async sync() {
		if (this.syncConfig && this.syncConfig.syncType && this.syncConfig.scope) {
			let syncHandler = this.syncHandlers.find(handler => handler.support(this.syncConfig.syncType));
			if (syncHandler) {
				await syncHandler.sync(this.syncConfig, this.context);
			} else {
				await this.defaultSyncHandler.sync(this.syncConfig, this.context);
			}
		}
	}
}
