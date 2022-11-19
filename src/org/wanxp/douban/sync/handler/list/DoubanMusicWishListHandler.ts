import { DoubanSubjectState} from "src/org/wanxp/constant/DoubanUserState";
import {DoubanMusicListHandler} from "./DoubanMusicListHandler";


export default class DoubanMusicWishListHandler extends DoubanMusicListHandler{
	getDoType(): string {
		return DoubanSubjectState.wish;
	}

}
