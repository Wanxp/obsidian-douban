import DoubanAbstractListHandler from "./DoubanAbstractListHandler";
import { SyncType} from "../../../../constant/Constsant";

export abstract class DoubanBookListHandler extends DoubanAbstractListHandler {
	getSyncType(): string {
		return SyncType.book;
	}

	abstract getDoType(): string;

}


