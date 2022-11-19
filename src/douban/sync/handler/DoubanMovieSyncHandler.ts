import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";
import {SyncType} from "../../../constant/Constsant";
import {SyncConfig} from "@App/sync/model/SyncConfig";
import HandleContext from "@App/data/model/HandleContext";
import DoubanSubjectLoadHandler from "@App/data/handler/DoubanSubjectLoadHandler";
import DoubanMovieLoadHandler from "@App/data/handler/DoubanMovieLoadHandler";
import DoubanMovieSubject from "@App/data/model/DoubanMovieSubject";
import DoubanPlugin from "../../../../main";
import {SubjectListItem} from "@App/data/model/SubjectListItem";
import DoubanMovieCollectListHandler from "@App/sync/handler/list/DoubanMovieCollectListHandler";
import {DoubanListHandler} from "@App/sync/handler/list/DoubanListHandler";
import DoubanMovieWishListHandler from "./list/DoubanMovieWishListHandler";
import DoubanMovieDoListHandler from "@App/sync/handler/list/DoubanMovieDoListHandler";

//TODO will support in future version
export class DoubanMovieSyncHandler extends DoubanAbstractSyncHandler {

	private doubanSubjectLoadHandler:DoubanSubjectLoadHandler<DoubanMovieSubject>;
	private doubanListHandlers:DoubanListHandler[];

	constructor(plugin:DoubanPlugin) {
		super(plugin);
		this.doubanSubjectLoadHandler = new DoubanMovieLoadHandler(plugin);
		this.doubanListHandlers = [
			new DoubanMovieCollectListHandler(),
			new DoubanMovieWishListHandler(),
			new DoubanMovieDoListHandler(),
		]
	}



	getSyncType(): SyncType {
		return SyncType.movie;
	}



	async sync(syncConfig: SyncConfig, context: HandleContext): Promise<void>{
		Promise.resolve()
			.then(() => this.getItems(syncConfig, context))
			.then(this.removeExists)
			.then((items) => {
				items.forEach(item => {
					item.id
					this.doubanSubjectLoadHandler.handle(item.url, context);
				})
			})
	}


	private async getItems(syncConfig:SyncConfig, context:HandleContext):Promise<SubjectListItem[]> {
		return this.doubanListHandlers.find((h) => h.support(syncConfig)).getAllPageList(context);
	}

	private async removeExists(items:SubjectListItem[]):Promise<SubjectListItem[]> {
		return items;
	}
}
