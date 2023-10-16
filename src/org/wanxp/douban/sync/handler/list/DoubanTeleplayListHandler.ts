import DoubanAbstractListHandler from "./DoubanAbstractListHandler";
import { SyncType} from "../../../../constant/Constsant";

export abstract class DoubanTeleplayListHandler extends DoubanAbstractListHandler {
	getSyncType(): SyncType {
		return SyncType.teleplay;
	}

	abstract getDoType(): string;

}


