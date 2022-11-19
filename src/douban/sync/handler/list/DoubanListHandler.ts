import HandleContext from "@App/data/model/HandleContext";
import {SubjectListItem} from "@App/data/model/SubjectListItem";
import {SyncConfig} from "@App/sync/model/SyncConfig";

export interface DoubanListHandler {

	getAllPageList(context: HandleContext):Promise<SubjectListItem[]>;

	support(config:SyncConfig):boolean;
}
