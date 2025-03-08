import { DoubanSubjectState} from "src/org/wanxp/constant/DoubanUserState";
import { DoubanMovieListHandler } from "./DoubanMovieListHandler";
import {DoubanGameListHandler} from "./DoubanGameListHandler";


export default class DoubanGameDoListHandler extends DoubanMovieListHandler{
	getDoType(): string {
		return  DoubanSubjectState.do;
	}

}
