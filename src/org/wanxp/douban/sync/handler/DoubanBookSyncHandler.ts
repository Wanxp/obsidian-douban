import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";
import DoubanPlugin from "../../../main";
import {SyncType} from "../../../constant/Constsant";
import DoubanBookSubject from "../../data/model/DoubanBookSubject";
import DoubanBookLoadHandler from "../../data/handler/DoubanBookLoadHandler";
import DoubanBookWishListHandler from "./list/DoubanBookWishListHandler";
import DoubanBookCollectListHandler from "./list/DoubanBookCollectListHandler";
import DoubanBookDoListHandler from "./list/DoubanBookDoListHandler";

//TODO will support in future version
export class DoubanBookSyncHandler extends DoubanAbstractSyncHandler<DoubanBookSubject> {

	constructor(plugin:DoubanPlugin) {
		super(plugin, new DoubanBookLoadHandler(plugin),[
			new DoubanBookCollectListHandler(),
			new DoubanBookWishListHandler(),
			new DoubanBookDoListHandler()]);
	}

    getSyncType(): SyncType {
		return SyncType.book;
    }


}
