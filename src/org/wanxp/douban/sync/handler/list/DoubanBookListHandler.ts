import DoubanAbstractListHandler from "./DoubanAbstractListHandler";
import {SyncType, SyncTypeUrlDomain} from "../../../../constant/Constsant";

export abstract class DoubanBookListHandler extends DoubanAbstractListHandler {
	getSyncType(): SyncType {
		return SyncType.book;
	}

	abstract getDoType(): string;

}


