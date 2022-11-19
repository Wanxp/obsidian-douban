import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";
import DoubanPlugin from "../../../main";
import {SyncType} from "../../../constant/Constsant";
import DoubanMusicSubject from "../../data/model/DoubanMusicSubject";
import DoubanMusicCollectListHandler from "./list/DoubanMusicCollectListHandler";
import DoubanMusicLoadHandler from "../../data/handler/DoubanMusicLoadHandler";
import DoubanMusicWishListHandler from "./list/DoubanMusicWishListHandler";
import DoubanMusicDoListHandler from "./list/DoubanMusicDoListHandler";

//TODO will support in future version
export class DoubanMusicSyncHandler extends DoubanAbstractSyncHandler<DoubanMusicSubject> {

	getSyncType(): SyncType {
		return SyncType.music;
	}

	constructor(plugin: DoubanPlugin) {
		super(plugin, new DoubanMusicLoadHandler(plugin), [
			new DoubanMusicCollectListHandler(),
			new DoubanMusicWishListHandler(),
			new DoubanMusicDoListHandler()]);
	}


}
