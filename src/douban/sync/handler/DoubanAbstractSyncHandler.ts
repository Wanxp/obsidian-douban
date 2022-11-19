import {CheerioAPI} from "cheerio";
import DoubanSyncSubject from "../model/DoubanSyncSubject";
import DoubanPlugin from "../../../../main";
import {SyncType} from "../../../constant/Constsant";
import {DoubanSyncHandler} from "@App/sync/handler/DoubanSyncHandler";
import { SyncConfig } from "../model/SyncConfig";
import HandleContext from "@App/data/model/HandleContext";

export abstract class DoubanAbstractSyncHandler implements  DoubanSyncHandler{

	private plugin: DoubanPlugin;

	constructor(plugin: DoubanPlugin) {
		this.plugin = plugin;
	}

	support(t: string): boolean {
		return this.getSyncType() == t;
	}

	abstract  sync(syncConfig: SyncConfig, context: HandleContext): Promise<void>;

	abstract getSyncType(): SyncType;
}


