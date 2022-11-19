import {CheerioAPI} from "cheerio";
import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";
import DoubanBroadcastMovieSubject from "../model/DoubanBroadcastMoveSubject";
import DoubanPlugin from "../../../../main";
import {SyncType} from "../../../constant/Constsant";
import {SyncConfig} from "@App/sync/model/SyncConfig";
import HandleContext from "@App/data/model/HandleContext";

//TODO will support in future version
export class DoubanOtherSyncHandler extends DoubanAbstractSyncHandler {

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
