import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";
import DoubanPlugin from "../../../main";
import {SyncType} from "../../../constant/Constsant";
import {SyncConfig} from "../model/SyncConfig";
import HandleContext from "../../data/model/HandleContext";
import DoubanSubject from "../../data/model/DoubanSubject";
import DoubanOtherLoadHandler from "../../data/handler/DoubanOtherLoadHandler";

//TODO will support in future version
export class DoubanOtherSyncHandler extends DoubanAbstractSyncHandler<DoubanSubject> {

	constructor(plugin:DoubanPlugin) {
		super(plugin, new DoubanOtherLoadHandler(plugin),[]);
	}


	getSyncType(): SyncType {
        throw new Error("暂不支持同步这类型的数据");
    }



	support(t: string): boolean {
		throw new Error("Method not implemented.");
	}

	async sync(syncConfig: SyncConfig, context: HandleContext): Promise<void>{
		return Promise.resolve();
	}



}
