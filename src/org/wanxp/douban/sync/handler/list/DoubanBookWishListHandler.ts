import { DoubanSubjectState} from "src/org/wanxp/constant/DoubanUserState";
import { DoubanBookListHandler } from "./DoubanBookListHandler";


export default class DoubanBookWishListHandler extends DoubanBookListHandler{
	getDoType(): string {
		return DoubanSubjectState.wish;
	}

}
