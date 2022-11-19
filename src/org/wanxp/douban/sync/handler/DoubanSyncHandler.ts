import {CheerioAPI} from "cheerio";
import DoubanSyncSubject from "../model/DoubanSyncSubject";
import {SyncConfig} from "../model/SyncConfig";
import HandleContext from "../../data/model/HandleContext";

export interface DoubanSyncHandler {

	support(t: string): boolean;

	sync(syncConfig: SyncConfig, context: HandleContext):Promise<void> ;

}


