import HandleContext from "@App/data/model/HandleContext";
import {SyncConfig} from "@App/sync/model/SyncConfig";
import DoubanPlugin from "main";
import {App} from "obsidian";
import {DoubanSyncHandler} from "@App/sync/handler/DoubanSyncHandler";
import DoubanOtherLoadHandler from "@App/data/handler/DoubanOtherLoadHandler";
import DoubanMovieLoadHandler from "@App/data/handler/DoubanMovieLoadHandler";
import DoubanBookLoadHandler from "@App/data/handler/DoubanBookLoadHandler";
import {DoubanTeleplayLoadHandler} from "@App/data/handler/DoubanTeleplayLoadHandler";
import DoubanMusicLoadHandler from "@App/data/handler/DoubanMusicLoadHandler";
import DoubanNoteLoadHandler from "@App/data/handler/DoubanNoteLoadHandler";
import DoubanGameLoadHandler from "@App/data/handler/DoubanGameLoadHandler";
import { DoubanBroadcastSyncHandler } from "./DoubanBroadcastSyncHandler";
import {DoubanOtherSyncHandler} from "@App/sync/handler/DoubanOtherSyncHandler";
import { DoubanMovieSyncHandler } from "./DoubanMovieSyncHandler";
import { DoubanNoteSyncHandler } from "./DoubanNoteSyncHandler";
import { DoubanMusicSyncHandler } from "./DoubanMusicSyncHandler";
import { DoubanBookSyncHandler } from "./DoubanBookSyncHandler";
import DoubanSubjectLoadHandler from "@App/data/handler/DoubanSubjectLoadHandler";
import DoubanSubject from "@App/data/model/DoubanSubject";
import {DoubanAbstractSyncHandler} from "@App/sync/handler/DoubanAbstractSyncHandler";

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
				 new DoubanBroadcastSyncHandler(plugin),
				 new DoubanNoteSyncHandler(plugin),
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
