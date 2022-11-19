import {CheerioAPI} from "cheerio";
import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";
import DoubanBroadcastMovieSubject from "../model/DoubanBroadcastMoveSubject";
import DoubanPlugin from "../../../../main";
import {SyncType} from "../../../constant/Constsant";
import {SyncConfig} from "@App/sync/model/SyncConfig";
import HandleContext from "@App/data/model/HandleContext";

//TODO will support in future version
export class DoubanBookSyncHandler extends DoubanAbstractSyncHandler {
    getSyncType(): SyncType {
		return SyncType.book;
    }

	async sync(syncConfig: SyncConfig, context: HandleContext): Promise<void>{
		return Promise.resolve();
	}

}
