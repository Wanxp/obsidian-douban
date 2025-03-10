import { DoubanSubjectState} from "src/org/wanxp/constant/DoubanUserState";
import { DoubanMovieListHandler } from "./DoubanMovieListHandler";
import {DoubanGameListHandler} from "./DoubanGameListHandler";


export default class DoubanGameWishListHandler extends DoubanGameListHandler{
	getDoType(): string {
		return DoubanSubjectState.wish;
	}

}
