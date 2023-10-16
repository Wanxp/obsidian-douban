import DoubanAbstractListHandler from "./DoubanAbstractListHandler";
import { SyncType} from "../../../../constant/Constsant";

export abstract class DoubanMovieListHandler extends DoubanAbstractListHandler {
	getSyncType(): SyncType {
		return SyncType.movie;
	}

	abstract getDoType(): string;

}


