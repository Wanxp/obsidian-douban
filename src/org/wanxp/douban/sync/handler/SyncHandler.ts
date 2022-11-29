import HandleContext from "../../data/model/HandleContext";
import {SyncConfig} from "../model/SyncConfig";
import DoubanPlugin from "../../../main";
import {App, moment} from "obsidian";
import {DoubanSyncHandler} from "./DoubanSyncHandler";
import {DoubanOtherSyncHandler} from "./DoubanOtherSyncHandler";
import { DoubanMovieSyncHandler } from "./DoubanMovieSyncHandler";
import { DoubanMusicSyncHandler } from "./DoubanMusicSyncHandler";
import { DoubanBookSyncHandler } from "./DoubanBookSyncHandler";
import {i18nHelper} from "../../../lang/helper";

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
		await this.showResult();
	}

	async showResult() {
		const {syncStatusHolder} = this.context;
		const {statusHandleMap} = syncStatusHolder.syncStatus;
		const {syncResultMap} = syncStatusHolder.syncStatus;
		let summary:string = `${i18nHelper.getMessage('syncall')}: ${syncStatusHolder.getSyncTotal()}
`;
		for (const [key, value] of statusHandleMap) {
			// @ts-ignore
			summary+= `${i18nHelper.getMessage(key)}:  ${value}
`;
		}
		let details:string = '';
		for (const [key, value] of syncResultMap) {
			// @ts-ignore
			details+= `${value.id}-[[${value.title}]]:  ${i18nHelper.getMessage(value.status)}
`;
		}
		summary+= `${i18nHelper.getMessage('notsync')}: ${syncStatusHolder.getSyncTotal() - syncStatusHolder.getSyncHandle()} 
`

		const result : string = i18nHelper.getMessage('110037', summary, details);
		const resultFileName = `${i18nHelper.getMessage('110038')}_${moment(new Date()).format('YYYYMMDDHHmmss')}`
		await this.plugin.fileHandler.createNewNoteWithData(`${this.syncConfig.dataFilePath}/${resultFileName}`, result, true);
	}
}
