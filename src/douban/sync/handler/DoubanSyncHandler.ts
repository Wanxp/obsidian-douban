import {CheerioAPI} from "cheerio";
import DoubanSyncSubject from "../model/DoubanSyncSubject";
import {SyncConfig} from "@App/sync/model/SyncConfig";
import HandleContext from "@App/data/model/HandleContext";

export interface DoubanSyncHandler {

	support(t: string): boolean;

	sync(syncConfig: SyncConfig, context: HandleContext):Promise<void> ;

}


