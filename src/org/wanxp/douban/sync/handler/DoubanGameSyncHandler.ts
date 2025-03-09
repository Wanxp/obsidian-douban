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
import DoubanGameLoadHandler from "../../data/handler/DoubanGameLoadHandler";
import DoubanGameCollectListHandler from "./list/DoubanGameCollectListHandler";
import DoubanGameWishListHandler from "./list/DoubanGameWishListHandler";
import DoubanGameDoListHandler from "./list/DoubanGameDoListHandler";
import DoubanGameSubject from "../../data/model/DoubanGameSubject";

//TODO will support in future version
export class DoubanGameSyncHandler extends DoubanAbstractSyncHandler<DoubanGameSubject>{

	constructor(plugin:DoubanPlugin) {
		super(plugin, new DoubanGameLoadHandler(plugin),[
			new DoubanGameCollectListHandler(),
			new DoubanGameWishListHandler(),
			new DoubanGameDoListHandler()]);
	}



	getSyncType(): SyncType {
		return SyncType.game;
	}



}
