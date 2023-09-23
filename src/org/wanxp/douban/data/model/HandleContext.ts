import DoubanPlugin from "../../../main";
import { DoubanPluginSetting } from "../../setting/model/DoubanPluginSetting";
import DoubanSubject from "./DoubanSubject";
import {Editor} from "obsidian";
import GlobalStatusHolder from "../../model/GlobalStatusHolder";
import NetFileHandler from "src/org/wanxp/net/NetFileHandler";
import {SearchHandleMode} from "../../../constant/Constsant";
import {SearchPageInfo} from "./SearchPageInfo";
import {SearchResultsPage} from "schema-dts";
import {SyncConfig} from "../../sync/model/SyncConfig";
import SyncStatusHolder from "../../sync/model/SyncStatusHolder";
import UserComponent from "../../user/UserComponent";

export default interface HandleContext {
	plugin:DoubanPlugin;
	mode:SearchHandleMode;
	settings: DoubanPluginSetting;
	editor?:Editor;
	userComponent: UserComponent;
	netFileHandler: NetFileHandler;
	showAfterCreate?:boolean;
	syncStatusHolder?:GlobalStatusHolder;
	action:string;
	syncConfig?: SyncConfig;
	listItem?:DoubanSubject;
	syncActive?:boolean;

	searchPage?:SearchPageInfo;

}
