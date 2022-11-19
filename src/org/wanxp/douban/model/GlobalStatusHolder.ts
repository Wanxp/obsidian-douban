import GlobalSyncStatusHolder from "../sync/model/GlobalSyncStatusHolder";
import {SyncConfig} from "../sync/model/SyncConfig";
import {Notice} from "obsidian";
import {i18nHelper} from "../../lang/helper";
import {SyncTypeRecords} from "../../constant/Constsant";
import {DoubanSubjectState} from "../../constant/DoubanUserState";

export default class GlobalStatusHolder {
	public syncStatus:GlobalSyncStatusHolder;

	public completeSync() {
		this.syncStatus = null;
	}

	public startSync(syncConfigOut: SyncConfig):boolean {
		if (this.syncStatus) {
			const {syncConfig} = this.syncStatus;
			// @ts-ignore
			new Notice(i18nHelper.getMessage('110008'), SyncTypeRecords[syncConfig.syncType], DoubanSubjectState[syncConfig.scope]);
			return false;
		}
		this.syncStatus = new GlobalSyncStatusHolder(syncConfigOut);
		return true;
	}

	public stopSync() {
		this.syncStatus = null;
	}

	public syncing() {
		return this.syncStatus;
	}
}
