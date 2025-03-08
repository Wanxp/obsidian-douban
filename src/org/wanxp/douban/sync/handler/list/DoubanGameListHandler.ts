import DoubanAbstractListHandler from "./DoubanAbstractListHandler";
import { SyncType} from "../../../../constant/Constsant";

export abstract class DoubanGameListHandler extends DoubanAbstractListHandler {
	getSyncType(): SyncType {
		return SyncType.game;
	}

	abstract getDoType(): string;

}


