import { DoubanSubjectState} from "src/org/wanxp/constant/DoubanUserState";
import { DoubanMovieListHandler } from "./DoubanMovieListHandler";


export default class DoubanMovieDoListHandler extends DoubanMovieListHandler{
	getDoType(): string {
		return  DoubanSubjectState.do;
	}

}
