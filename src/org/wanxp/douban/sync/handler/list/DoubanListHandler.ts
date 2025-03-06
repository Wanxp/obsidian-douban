import HandleContext from "../../../data/model/HandleContext";
import {SyncConfig} from "../../model/SyncConfig";
import {SearchPage} from "../../../data/model/SearchPage";

export interface DoubanListHandler {

	getPageData(context: HandleContext):Promise<SearchPage>;

	support(config:SyncConfig):boolean;
}
