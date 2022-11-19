import {CheerioAPI} from "cheerio";
import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";
import DoubanBroadcastMovieSubject from "../model/DoubanBroadcastMoveSubject";
import DoubanPlugin from "../../../main";
import {SyncType} from "../../../constant/Constsant";
import {SyncConfig} from "../model/SyncConfig";
import HandleContext from "../../data/model/HandleContext";
import DoubanSubject from "../../data/model/DoubanSubject";

//TODO will support in future version
export class DoubanBroadcastSyncHandler extends DoubanAbstractSyncHandler<DoubanSubject> {

	getSyncType(): SyncType {
		return SyncType.broadcast;
	}

	support(t: string): boolean {
		throw new Error("Method not implemented.");
	}

	async sync(syncConfig: SyncConfig, context: HandleContext): Promise<void>{
		return Promise.resolve();
	}


}
