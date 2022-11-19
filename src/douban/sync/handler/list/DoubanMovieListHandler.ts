import DoubanAbstractListHandler from "@App/sync/handler/list/DoubanAbstractListHandler";
import { SyncType} from "../../../../constant/Constsant";

export abstract class DoubanMovieListHandler extends DoubanAbstractListHandler {
	getSyncType(): string {
		return SyncType.movie;
	}

	abstract getDoType(): string;

}


