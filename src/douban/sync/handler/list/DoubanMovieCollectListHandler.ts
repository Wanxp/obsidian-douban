import { DoubanSubjectState} from "src/constant/DoubanUserState";
import { DoubanMovieListHandler } from "./DoubanMovieListHandler";


export default class DoubanMovieCollectListHandler extends DoubanMovieListHandler{
	getDoType(): string {
		return  DoubanSubjectState.collect;
	}

}
