import { DoubanSubjectState} from "src/org/wanxp/constant/DoubanUserState";
import { DoubanMovieListHandler } from "./DoubanMovieListHandler";


export default class DoubanMovieCollectListHandler extends DoubanMovieListHandler{
	getDoType(): string {
		return  DoubanSubjectState.collect;
	}

}
