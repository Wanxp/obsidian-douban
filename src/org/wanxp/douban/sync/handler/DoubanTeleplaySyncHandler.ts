import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";
import {BasicConst, SyncType} from "../../../constant/Constsant";
import DoubanPlugin from "../../../main";
import DoubanTeleplaySubject from "../../data/model/DoubanTeleplaySubject";
import {DoubanTeleplayLoadHandler} from "../../data/handler/DoubanTeleplayLoadHandler";
import DoubanTeleplayCollectListHandler from "./list/DoubanTeleplayCollectListHandler";
import DoubanTeleplayWishListHandler from "./list/DoubanTeleplayWishListHandler";
import DoubanTeleplayDoListHandler from "./list/DoubanTeleplayDoListHandler";

//TODO will support in future version
export class DoubanTeleplaySyncHandler extends DoubanAbstractSyncHandler<DoubanTeleplaySubject>{

	constructor(plugin:DoubanPlugin) {
		super(plugin, new DoubanTeleplayLoadHandler(plugin),[
			new DoubanTeleplayCollectListHandler(),
			new DoubanTeleplayWishListHandler(),
			new DoubanTeleplayDoListHandler()]);
	}



	getSyncType(): SyncType {
		return SyncType.teleplay;
	}



}
