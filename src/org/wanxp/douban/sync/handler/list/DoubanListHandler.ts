import HandleContext from "../../../data/model/HandleContext";
import {SubjectListItem} from "../../../data/model/SubjectListItem";
import {SyncConfig} from "../../model/SyncConfig";

export interface DoubanListHandler {

	getAllPageList(context: HandleContext):Promise<SubjectListItem[]>;

	support(config:SyncConfig):boolean;
}
