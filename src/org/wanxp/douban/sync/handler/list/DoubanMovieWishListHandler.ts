import { DoubanSubjectState} from "src/org/wanxp/constant/DoubanUserState";
import { DoubanMovieListHandler } from "./DoubanMovieListHandler";


export default class DoubanMovieWishListHandler extends DoubanMovieListHandler{
	getDoType(): string {
		return DoubanSubjectState.wish;
	}

}
