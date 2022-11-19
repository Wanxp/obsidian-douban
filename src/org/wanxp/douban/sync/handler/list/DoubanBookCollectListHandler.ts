import { DoubanSubjectState} from "src/org/wanxp/constant/DoubanUserState";
import {DoubanBookListHandler} from "./DoubanBookListHandler";


export default class DoubanBookCollectListHandler extends DoubanBookListHandler{
	getDoType(): string {
		return  DoubanSubjectState.collect;
	}

}
