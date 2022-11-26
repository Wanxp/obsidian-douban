import {SyncConfig} from "./SyncConfig";
import GlobalSyncStatusHolder from "./GlobalSyncStatusHolder";
import {SyncItemResult} from "./SyncItemResult";
import {SyncItemStatus} from "../../../constant/Constsant";
import GlobalStatusHolder from "../../model/GlobalStatusHolder";

export default class SyncStatusHolder extends GlobalSyncStatusHolder{

	public syncResultMap: Map<string, SyncItemResult> = new Map();
	public statusHandleMap: Map<SyncItemStatus, number> = new Map([
	[SyncItemStatus.exists, 0],
	[SyncItemStatus.replace, 0],
	[SyncItemStatus.create, 0],
	[SyncItemStatus.fail, 0],
]);
	private globalStatus:GlobalStatusHolder;


	constructor(syncConfig: SyncConfig, globalStatus: GlobalStatusHolder) {
		super(syncConfig)
		this.globalStatus = globalStatus;
	}

	public replace(id:string, title:string) {
		this.updateResult(id, title, SyncItemStatus.replace);
	}

	public exists(id:string, title:string) {
		this.updateResult(id, title, SyncItemStatus.exists);
	}

	public create(id:string, title:string) {
		this.updateResult(id, title, SyncItemStatus.create);
	}

	public fail(id:string, title:string) {
		this.updateResult(id, title, SyncItemStatus.fail);
	}

	private updateResult(id:string, title:string, status:SyncItemStatus) {
		this.syncResultMap.set(id, {id: id,title:title,status:status});
		this.statusHandleMap.set(status, this.statusHandleMap.get(status) + 1);
		super.handled(1);
		if (this.globalStatus.syncing()) {
			this.globalStatus.syncStatus.handled(1);
		}
	}

	public setTotal(total:number) {
		super.totalNum(total);
		this.globalStatus.syncStatus.totalNum(total);
	}



}
