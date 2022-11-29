import {SyncConfig} from "./SyncConfig";
import GlobalSyncStatusHolder from "./GlobalSyncStatusHolder";
import {SyncItemResult} from "./SyncItemResult";
import {SyncItemStatus} from "../../../constant/Constsant";
import {HandleKey} from "./HandledKey";
import {HandleValue} from "./HandleValue";

export default class SyncStatusHolder extends GlobalSyncStatusHolder{

	public handledData: Map<HandleKey, Set<HandleValue>>;
	public syncResultMap: Map<string, SyncItemResult> = new Map();
	public statusHandleMap: Map<SyncItemStatus, number> = new Map([
	[SyncItemStatus.exists, 0],
	[SyncItemStatus.replace, 0],
	[SyncItemStatus.create, 0],
	[SyncItemStatus.fail, 0],
]);

	constructor(syncConfig: SyncConfig) {
		super(syncConfig)
	}

	public replace(id:string, title:string) {
		this.putToHandled(id, title);
		this.updateResult(id, title, SyncItemStatus.replace);
	}

	public exists(id:string, title:string) {
		this.putToHandled(id, title);
		this.updateResult(id, title, SyncItemStatus.exists);
	}

	public create(id:string, title:string) {
		this.putToHandled(id, title);
		this.updateResult(id, title, SyncItemStatus.create);
	}

	public fail(id:string, title:string) {
		this.updateResult(id, title, SyncItemStatus.fail);
	}

	private updateResult(id:string, title:string, status:SyncItemStatus) {
		this.syncResultMap.set(id, {id: id,title:title,status:status});
		this.statusHandleMap.set(status, this.statusHandleMap.get(status) + 1);
		super.handled(1);
	}

	public setTotal(total:number) {
		super.totalNum(total);
	}


	private putToHandled(id: string, title: string) {
		if (!this.handledData) {
			this.handledData = new Map<HandleKey, Set<HandleValue>>();
		}
		const key = {k: this.syncConfig.dataFilePath}
		if (!this.handledData.has(key)) {
			this.handledData.set(key, new Set<HandleValue>());
		}
		this.handledData.get(key).add({v:id})
	}

	resetSyncHandledSet() {
		if (!this.handledData) {
			return;
		}
		const key = {k: this.syncConfig.dataFilePath}
		if (this.handledData.has(key)) {
			this.handledData.set(key, new Set<HandleValue>());
		}
	}

	shouldSync(id: string) {
		const key = {k: this.syncConfig.dataFilePath}
		return !this.handledData.get(key).has({v:id});
	}
}
