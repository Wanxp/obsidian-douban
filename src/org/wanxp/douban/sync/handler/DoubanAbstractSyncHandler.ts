import {CheerioAPI} from "cheerio";
import DoubanSyncSubject from "../model/DoubanSyncSubject";
import DoubanPlugin from "../../../main";
import {BasicConst, SyncType} from "../../../constant/Constsant";
import {DoubanSyncHandler} from "./DoubanSyncHandler";
import { SyncConfig } from "../model/SyncConfig";
import HandleContext from "../../data/model/HandleContext";
import {SubjectListItem} from "../../data/model/SubjectListItem";
import {sleepRange} from "../../../utils/TimeUtil";
import DoubanSubjectLoadHandler from "../../data/handler/DoubanSubjectLoadHandler";
import {DoubanListHandler} from "./list/DoubanListHandler";
import DoubanSubject from "../../data/model/DoubanSubject";

export abstract class DoubanAbstractSyncHandler<T extends  DoubanSubject> implements  DoubanSyncHandler{

	private plugin: DoubanPlugin;
	private doubanSubjectLoadHandler:DoubanSubjectLoadHandler<T>;
	private doubanListHandlers:DoubanListHandler[];

	constructor(plugin: DoubanPlugin,
				doubanSubjectLoadHandler:DoubanSubjectLoadHandler<T>,
				doubanListHandlers:DoubanListHandler[]) {
		this.plugin = plugin;
		this.doubanSubjectLoadHandler = doubanSubjectLoadHandler;
		this.doubanListHandlers = doubanListHandlers;
	}

	support(t: string): boolean {
		return this.getSyncType() == t;
	}

	abstract getSyncType(): SyncType;

	async sync(syncConfig: SyncConfig, context: HandleContext): Promise<void>{
		return Promise.resolve()
			.then(() => this.getItems(syncConfig, context))
			.then(items => this.removeExists(items , syncConfig, context))
			.then(items => this.handleItems(items, context));
	}


	private async getItems(syncConfig:SyncConfig, context:HandleContext):Promise<SubjectListItem[]> {
		  const supportHandlers:DoubanListHandler[] = this.doubanListHandlers.filter((h) => h.support(syncConfig));
		  let items:SubjectListItem[] = [];
		  for(const handler of supportHandlers) {
			  if (!context.plugin.statusHolder.syncing()) {
				  return [];
			  }
			  const item = await handler.getAllPageList(context);
			  if (item) {
				  items = items.concat(item);
			  }
		  }
		  return items;
	}

	private async removeExists(items:SubjectListItem[], syncConfig: SyncConfig, context: HandleContext):Promise<SubjectListItem[]> {
		if (!context.plugin.statusHolder.syncing()) {
			return [];
		}
		return items;
	}

	private async handleItems(items:SubjectListItem[], context:HandleContext):Promise<void> {
		if (!items || items.length == 0) {
			return ;
		}
		const {syncStatus} = context.syncStatusHolder;
		syncStatus.totalNum(items.length);
		const needHandled:number = items.filter(item => syncStatus.shouldSync(item.id)).length;
		syncStatus.setNeedHandled(needHandled);
		for (const item of items) {
			if (!context.plugin.statusHolder.syncing()) {
				return;
			}
			if(syncStatus.shouldSync(item.id)) {
				await this.doubanSubjectLoadHandler.handle(item.url, context);
				await sleepRange(BasicConst.CALL_DOUBAN_DELAY, BasicConst.CALL_DOUBAN_DELAY + BasicConst.CALL_DOUBAN_DELAY_RANGE);
			}else {
				syncStatus.unHandle(item.id, item.title);
			}
		}
	}

}


