import {SyncConfig} from "../sync/model/SyncConfig";
import {App, Notice} from "obsidian";
import {i18nHelper} from "../../lang/helper";
import { SyncTypeRecords} from "../../constant/Constsant";
import {DoubanSubjectState} from "../../constant/DoubanUserState";
import SyncStatusHolder from "../sync/model/SyncStatusHolder";
import DoubanPlugin from "../../main";
import {SyncHandledData} from "../setting/model/SyncHandledData";

export default class GlobalStatusHolder {
	public syncStatus:SyncStatusHolder;
	public syncStarted:boolean;
	public syncStartTime:number;

	private _app:App;
	private _plugin:DoubanPlugin;


	constructor(app:App, plugin:DoubanPlugin) {
		this._app = app;
        this._plugin = plugin;
	}

	public async completeSync() {
		this.syncStarted = false;
		await this.saveHandledData();
	}

	public startSync(syncConfigOut: SyncConfig):boolean {
		if (this.syncStarted) {
			const {syncConfig} = this.syncStatus;
			// @ts-ignore
			new Notice(i18nHelper.getMessage('110008'), SyncTypeRecords[syncConfig.syncType], DoubanSubjectState[syncConfig.scope]);
			return false;
		}
		this.syncStatus = new SyncStatusHolder(syncConfigOut);
		this.syncStarted = true;
		this.syncStartTime = new Date().getTime();
		return true;
	}

	public stopSync() {
		this.syncStarted = false;
	}

	public syncing() {
		return this.syncStarted;
	}

	public async initHandledData() {
		this.syncStatus.initSyncHandledData(this._plugin.settings.syncHandledDataArray);
	}

	public async saveHandledData() {
		if(!this.syncStatus || !this.syncStatus.handledData) {
			return;
		}
		const data:SyncHandledData[] = [];
		this.syncStatus.handledData.forEach((value, key) => {
			data.push({key: key, value: Array.from(value)});
		})
		this._plugin.settings.syncHandledDataArray = data;
		await this._plugin.saveSettings();
	}

	public async onunload() {
		await this.saveHandledData();
	}
}
