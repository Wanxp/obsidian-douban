import { DoubanSubjectState} from "src/org/wanxp/constant/DoubanUserState";
import { DoubanMusicListHandler } from "./DoubanMusicListHandler";


export default class DoubanMusicCollectListHandler extends DoubanMusicListHandler{
	getDoType(): string {
		return  DoubanSubjectState.collect;
	}

}
