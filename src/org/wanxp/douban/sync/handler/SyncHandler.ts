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
import {DoubanTeleplaySyncHandler} from "./DoubanTeleplaySyncHandler";
import {SyncConditionType} from "../../../constant/Constsant";
import {DoubanGameSyncHandler} from "./DoubanGameSyncHandler";

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
				 new DoubanTeleplaySyncHandler(plugin),
				 new DoubanGameSyncHandler(plugin),
				 this.defaultSyncHandler
			 ];
	 }

	async sync() {
		if (this.syncConfig && this.syncConfig.syncType && this.syncConfig.scope) {
			if(this.checkSyncConfig()) {
				this.context.syncStatusHolder.syncStatus.setMessage(this.checkSyncConfig());
				return;
			}
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
		const {syncStatus} = syncStatusHolder;
		const {statusHandleMap} = syncStatus;
		const {syncResultMap} = syncStatus;
		const {syncConfig} = this;

		let extendCondition = '';
		if (syncConfig.syncConditionType == SyncConditionType.CUSTOM_ITEM) {
			extendCondition = `${syncConfig.syncConditionCountFromValue} - ${syncConfig.syncConditionCountToValue}`;
		} else if (syncConfig.syncConditionType == SyncConditionType.CUSTOM_TIME) {
			extendCondition = `${syncConfig.syncConditionDateFromValue.toISOString().substring(0, 10)} - ${syncConfig.syncConditionDateToValue.toISOString().substring(0, 10)}`;
		}


		const condition = `
1. ${i18nHelper.getMessage('110030')} \`${syncStatus.getTypeName()}\`
2. ${i18nHelper.getMessage('110032')} \`${syncStatus.getScopeName()}\`
3. ${i18nHelper.getMessage('110070')} \`${syncStatus.getSyncConditionName()}\`${extendCondition? (' => ' + extendCondition) : ''}
4. ${i18nHelper.getMessage('110039')} \`${syncConfig.incrementalUpdate?i18nHelper.getMessage('110055'):i18nHelper.getMessage('110056')}\`
5. ${i18nHelper.getMessage('110031')} \`${syncConfig.force?i18nHelper.getMessage('110055'):i18nHelper.getMessage('110056')}\`
`


		let summary:string
			= `${i18nHelper.getMessage('110053', i18nHelper.getMessage('110050'), i18nHelper.getMessage('110051'), i18nHelper.getMessage('110052'))} 
|-----|----|----------------------------------|
`;
		summary += `${i18nHelper.getMessage('110053', i18nHelper.getMessage('syncall'), syncStatus.getTotal(), i18nHelper.getMessage('syncall_desc'))}
`;
		for (const [key, value] of statusHandleMap) {
			// @ts-ignore
			summary+= `${i18nHelper.getMessage('110053', i18nHelper.getMessage(key), value, i18nHelper.getMessage(key + '_desc'))}
`;
		}
		summary += `${i18nHelper.getMessage('110053', i18nHelper.getMessage('notsync'), syncStatus.getTotal()-syncStatus.getHasHandle(), i18nHelper.getMessage('notsync_desc'))}
`;
		let details:string = '';
		for (const [key, value] of syncResultMap) {
			if (value.status == 'unHandle') {
				// @ts-ignore
				details+= `${value.id}-  ${value.title}  :  ${i18nHelper.getMessage(value.status)}
`;
			}else {
				// @ts-ignore
				details+= `${value.id}-[[${value.title}]]:  ${i18nHelper.getMessage(value.status)}
`;
			}

		}
		const result : string = i18nHelper.getMessage('110037', condition, summary, details);
		const resultFileName = `${i18nHelper.getMessage('110038')}_${moment(new Date()).format('YYYYMMDDHHmmss')}`
		await this.plugin.fileHandler.createNewNoteWithData(`${this.syncConfig.dataFilePath}/${resultFileName}`, result, true);
	}

	private checkSyncConfig() {
		 const {syncConfig} = this;
		 switch (syncConfig.syncConditionType) {
			 case SyncConditionType.CUSTOM_ITEM:
				 if (syncConfig.syncConditionCountFromValue && syncConfig.syncConditionCountToValue) {
					 if (syncConfig.syncConditionCountFromValue > syncConfig.syncConditionCountToValue) {
						 return i18nHelper.getMessage('110044');
					 }
				 }
			 	break;
			 case SyncConditionType.CUSTOM_TIME:
				 if (syncConfig.syncConditionDateToValue && syncConfig.syncConditionDateFromValue) {
					 if (syncConfig.syncConditionDateFromValue > syncConfig.syncConditionDateToValue) {
						 return i18nHelper.getMessage('110045');
					 }
				 }

		 }
	}
}
