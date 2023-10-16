import { DoubanSubjectState} from "src/org/wanxp/constant/DoubanUserState";
import { DoubanMovieListHandler } from "./DoubanMovieListHandler";
import {DoubanTeleplayListHandler} from "./DoubanTeleplayListHandler";


export default class DoubanTeleplayWishListHandler extends DoubanTeleplayListHandler{
	getDoType(): string {
		return DoubanSubjectState.wish;
	}

}
