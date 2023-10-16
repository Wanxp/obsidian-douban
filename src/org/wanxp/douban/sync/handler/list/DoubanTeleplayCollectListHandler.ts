import { DoubanSubjectState} from "src/org/wanxp/constant/DoubanUserState";
import { DoubanMovieListHandler } from "./DoubanMovieListHandler";
import {DoubanTeleplayListHandler} from "./DoubanTeleplayListHandler";


export default class DoubanTeleplayCollectListHandler extends DoubanTeleplayListHandler{
	getDoType(): string {
		return  DoubanSubjectState.collect;
	}

}
