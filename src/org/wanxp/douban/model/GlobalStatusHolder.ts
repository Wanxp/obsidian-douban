import {SyncConfig} from "../sync/model/SyncConfig";
import {App, Notice} from "obsidian";
import {i18nHelper} from "../../lang/helper";
import { SyncTypeRecords} from "../../constant/Constsant";
import {DoubanSubjectState} from "../../constant/DoubanUserState";
import SyncStatusHolder from "../sync/model/SyncStatusHolder";
import DoubanPlugin from "../../main";
import {HandleKey} from "../sync/model/HandledKey";
import {HandleValue} from "../sync/model/HandleValue";

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

	public syncReplace(id:string, title:string) {
		this.syncStatus.replace(id, title);
	}

	public syncExists(id:string, title:string) {
		this.syncStatus.exists(id, title);
	}

	public syncCreate(id:string, title:string) {
		this.syncStatus.create(id, title);
	}

	public syncFail(id:string, title:string) {
		this.syncStatus.fail(id, title);
	}

	public putSyncHandledData(handledData:Map<HandleKey, Set<HandleValue>>) {
		this.syncStatus.handledData = handledData;
	}

	public initSyncHandledData() {
		this.putSyncHandledData(this._plugin.settings.syncHandledData);
		const incrementalUpdate:boolean = this.syncStatus.syncConfig.incrementalUpdate;
		if (incrementalUpdate == false) {
			this.syncStatus.resetSyncHandledSet();
		}
	}

	public setTotal(total:number) {
		this.syncStatus.setTotal(total);
	}

	syncHandled(num:number) {
		this.syncStatus.handled(num);
	}

	syncTotalNum(num:number) {
		this.syncStatus.setTotal(num);
	}

	getSyncTotal():number {
		return this.syncStatus.getTotal();
	}

	getSyncHandle():number {
		return this.syncStatus.getHandle();
	}

	private async saveHandledData() {
		if(!this.syncStatus || !this.syncStatus.handledData) {
			return;
		}
		this._plugin.settings.syncHandledData = this.syncStatus.handledData;
		await this._plugin.saveSettings();

	}

	shouldSync(id: string) {
		return this.syncStatus.shouldSync(id);
	}
}
