import {SyncConfig} from "./SyncConfig";
import {SyncItemResult} from "./SyncItemResult";
import {
	BasicConst,
	SupportType,
	SyncConditionTypeRecords,
	SyncItemStatus,
	SyncTypeRecords
} from "../../../constant/Constsant";
import {SyncHandledData} from "../../setting/model/SyncHandledData";
import {
	DoubanSubjectState,
	DoubanSubjectStateRecords,
	DoubanSubjectStateRecords_SYNC
} from "../../../constant/DoubanUserState";

export default class SyncStatusHolder {

	public handledData: Map<string, Set<string>>;
	public syncResultMap: Map<string, SyncItemResult> = new Map();
	public statusHandleMap: Map<SyncItemStatus, number> = new Map([
	[SyncItemStatus.exists, 0],
	[SyncItemStatus.replace, 0],
	[SyncItemStatus.create, 0],
	[SyncItemStatus.fail, 0],
		[SyncItemStatus.failByDiffType, 0],
		[SyncItemStatus.unHandle, 0],
	]);

	private key: string;
	//不管处不处理的总数，比如会包含已经存在的，或者条件没覆盖的部分，比如过滤条件选择了1-2条，但总共其实有10条
	private allTotal: number;

	public syncConfig: SyncConfig;
	//处理的总数
	private total:number;
	private handle:number;
	private needHandled:number;
	private message:string = '';

	constructor(syncConfig: SyncConfig) {
		this.syncConfig = syncConfig;
		this.total = 0;
		this.handle = 0;
		this.needHandled = 0;
		this.key =this.getKey(syncConfig);
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

	getAllTotal():number {
		return this.allTotal;
	}

	setAllTotal(allTotal:number) {
		this.allTotal = allTotal;
	}



	/**
	 * 已处理总数，包含已经存在不需要同步的部分
	 */
	getHasHandle():number {
		return this.handle;
	}

	setNeedHandled(needHandled:number) {
		this.needHandled = needHandled;
	}

	getNeedHandled():number {
		return this.needHandled;
	}


	public replace(id:string, title:string) {
		this.putToHandled(id, title);
		this.updateResult(id, title, SyncItemStatus.replace);
	}

	public exists(id:string, title:string) {
		this.putToHandled(id, title);
		this.updateResult(id, title, SyncItemStatus.exists);
	}

	public unHandle(id:string, title:string) {
		this.updateResult(id, title, SyncItemStatus.unHandle);
	}


	public create(id:string, title:string) {
		this.putToHandled(id, title);
		this.updateResult(id, title, SyncItemStatus.create);
	}

	public fail(id:string, title:string) {
		this.updateResult(id, title, SyncItemStatus.fail);
	}

	public failByDiffType(id:string, title:string) {
		this.updateResult(id, title, SyncItemStatus.failByDiffType);
	}

	private updateResult(id:string, title:string, status:SyncItemStatus) {
		this.syncResultMap.set(id, {id: id,title:title,status:status});
		this.statusHandleMap.set(status, this.statusHandleMap.get(status) + 1);
		this.handled(1);
	}

	public setTotal(total:number) {
		this.totalNum(total);
	}


	private putToHandled(id: string, title: string) {
		if (!this.handledData) {
			this.handledData = new Map<string, Set<string>>();
		}
		const {key} = this;
		if (!this.handledData.has(key)) {
			this.handledData.set(key, new Set<string>());
		}
		this.handledData.get(key).add(id)
	}

	shouldSync(id: string) {
		return this.handledData.get(this.key)?!this.handledData.get(this.key).has(id):true;
	}

	 getKey(syncConfig: SyncConfig):string {
		 const type:string = syncConfig.syncType ? syncConfig.syncType : '';
		 const scope:string = syncConfig.scope ? syncConfig.scope : '';
		 const path:string = syncConfig.dataFilePath ? syncConfig.dataFilePath : '';
		 return `${path}+${type}+${scope}`;
	 }

	getOverSize():boolean {
		return this.getNeedHandled() > BasicConst.SLOW_SIZE;
	}

	public initSyncHandledData(data:SyncHandledData[]) {
		this.handledData = new Map<string, Set<string>>();
		const {handledData} = this;
		data.forEach((d) => {
			handledData.set(d.key,new Set<string>(d.value));
		})
		if (!this.syncConfig.incrementalUpdate) {
			this.resetSyncHandledData();
		}
		this.resetTypeOtherSyncHandledData();
	}

	public resetSyncHandledData() {
		return this.handledData.set(this.key, new Set());
	}

	public resetTypeOtherSyncHandledData() {
		this.handledData.forEach((value, key) => {
			if (this.needClearByKey(this.key, key)) {
				value.clear();
			}
		});
	}

	private needClearByKey(handleKey:string, savedKey:string):boolean {
		if (handleKey == savedKey) {
			return false;
		}
		let handledKeys = handleKey.split('+');
		let savedKeys = savedKey.split('+');
		handledKeys = handledKeys??[''];
		savedKeys = savedKeys??[''];
		if (handledKeys[0] == savedKeys[0]) {
			return true;
		}
		return false;
	}

	public setMessage(s: string) {
		this.message = s;
	}

	public getMessage() {
		return this.message;
	}

	public getScopeName():string {
		//@ts-ignore
		return DoubanSubjectStateRecords_SYNC[this.syncConfig.syncType][this.syncConfig.scope];
	}

	public getTypeName():string {
		return SyncTypeRecords[this.syncConfig.syncType];


	}

	public getSyncConditionName() {
		return SyncConditionTypeRecords[this.syncConfig.syncConditionType];
	}
}
