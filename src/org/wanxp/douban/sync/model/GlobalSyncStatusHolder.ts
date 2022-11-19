import {SyncConfig} from "./SyncConfig";
import {SyncItemStatus} from "../../../constant/Constsant";

export default class GlobalSyncStatusHolder {
	public syncConfig: SyncConfig;
	private total:number;
	private handle:number;

	constructor(syncConfig: SyncConfig) {
		this.syncConfig = syncConfig;
		this.total = 100;
		this.handle = 1;
	}

	handled(num:number) {
		this.handle = this.handle + num;
	}

	totalNum(num:number) {
		this.total = num ;
	}

	getTotal():number {
		return this.total;
	}

	getHandle():number {
		return this.handle;
	}
}
