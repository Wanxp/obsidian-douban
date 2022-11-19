import {CheerioAPI} from "cheerio";
import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";
import DoubanBroadcastMovieSubject from "../model/DoubanBroadcastMoveSubject";
import DoubanPlugin from "../../../../main";
import {SyncType} from "../../../constant/Constsant";
import {SyncConfig} from "@App/sync/model/SyncConfig";
import HandleContext from "@App/data/model/HandleContext";

//TODO will support in future version
export class DoubanMusicSyncHandler extends DoubanAbstractSyncHandler {

	getSyncType(): SyncType {
		return SyncType.music;
	}

	support(t: string): boolean {
		throw new Error("Method not implemented.");
	}

	async sync(syncConfig: SyncConfig, context: HandleContext): Promise<void>{
		return Promise.resolve();
	}



}
