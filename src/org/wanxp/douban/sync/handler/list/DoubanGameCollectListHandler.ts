import { DoubanSubjectState} from "src/org/wanxp/constant/DoubanUserState";
import { DoubanMovieListHandler } from "./DoubanMovieListHandler";
import {DoubanGameListHandler} from "./DoubanGameListHandler";


export default class DoubanGameCollectListHandler extends DoubanMovieListHandler{
	getDoType(): string {
		return  DoubanSubjectState.collect;
	}

}
