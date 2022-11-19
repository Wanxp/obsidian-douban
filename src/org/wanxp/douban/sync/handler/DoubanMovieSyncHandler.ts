import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";
import {BasicConst, SyncType} from "../../../constant/Constsant";
import {SyncConfig} from "../model/SyncConfig";
import HandleContext from "../../data/model/HandleContext";
import DoubanSubjectLoadHandler from "../../data/handler/DoubanSubjectLoadHandler";
import DoubanMovieLoadHandler from "../../data/handler/DoubanMovieLoadHandler";
import DoubanMovieSubject from "../../data/model/DoubanMovieSubject";
import DoubanPlugin from "../../../main";
import {SubjectListItem} from "../../data/model/SubjectListItem";
import DoubanMovieCollectListHandler from "./list/DoubanMovieCollectListHandler";
import {DoubanListHandler} from "./list/DoubanListHandler";
import DoubanMovieWishListHandler from "./list/DoubanMovieWishListHandler";
import DoubanMovieDoListHandler from "./list/DoubanMovieDoListHandler";
import TimeUtil, {sleepRange} from "../../../utils/TimeUtil";
import {log} from "../../../utils/Logutil";

//TODO will support in future version
export class DoubanMovieSyncHandler extends DoubanAbstractSyncHandler<DoubanMovieSubject>{

	constructor(plugin:DoubanPlugin) {
		super(plugin, new DoubanMovieLoadHandler(plugin),[
			new DoubanMovieCollectListHandler(),
			new DoubanMovieWishListHandler(),
			new DoubanMovieDoListHandler()]);
	}



	getSyncType(): SyncType {
		return SyncType.movie;
	}



}
