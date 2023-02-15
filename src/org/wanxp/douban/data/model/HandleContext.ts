import {SearchHandleMode} from "../../../constant/Constsant";
import {Editor} from "obsidian";
import { DoubanPluginSetting } from "../../setting/model/DoubanPluginSetting";
import UserComponent from "../../user/UserComponent";
import NetFileHandler from "src/org/wanxp/net/NetFileHandler";
import DoubanPlugin from "../../../main";
import SyncStatusHolder from "../../sync/model/SyncStatusHolder";
import {SyncConfig} from "../../sync/model/SyncConfig";
import DoubanSubject from "./DoubanSubject";
import GlobalStatusHolder from "../../model/GlobalStatusHolder";
import {SearchResultsPage} from "schema-dts";
import {SearchPageInfo} from "./SearchPageInfo";

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

	searchPage:SearchPageInfo;
}
