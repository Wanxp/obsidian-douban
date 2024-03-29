import DoubanAbstractListHandler from "./DoubanAbstractListHandler";
import { SyncType} from "../../../../constant/Constsant";

export abstract class DoubanMusicListHandler extends DoubanAbstractListHandler {
	getSyncType(): SyncType {
		return SyncType.music;
	}

	abstract getDoType(): string;

}


