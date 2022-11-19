import {SyncConfig} from "./SyncConfig";
import {SyncItemStatus} from "../../../constant/Constsant";

export default class GlobalSyncStatusHolder {
	public syncConfig: SyncConfig;
	private total:number;
	private handle:number;
	private startTime:number;

	constructor(syncConfig: SyncConfig) {
		this.syncConfig = syncConfig;
		this.startTime = new Date().getTime();
		this.total = 0;
		this.handle = 0;
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
