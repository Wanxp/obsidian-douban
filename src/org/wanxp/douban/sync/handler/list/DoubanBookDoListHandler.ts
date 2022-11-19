import { DoubanSubjectState} from "src/org/wanxp/constant/DoubanUserState";
import { DoubanBookListHandler } from "./DoubanBookListHandler";


export default class DoubanBookDoListHandler extends DoubanBookListHandler{
	getDoType(): string {
		return  DoubanSubjectState.do;
	}

}
