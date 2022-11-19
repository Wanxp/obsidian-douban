import {SearchHandleMode} from "../../../constant/Constsant";
import {Editor} from "obsidian";
import { DoubanPluginSetting } from "../../setting/model/DoubanPluginSetting";
import UserComponent from "../../user/UserComponent";
import NetFileHandler from "src/org/wanxp/net/NetFileHandler";
import DoubanPlugin from "../../../main";
import SyncStatusHolder from "../../sync/model/SyncStatusHolder";

export default interface HandleContext {
	plugin:DoubanPlugin;
	mode:SearchHandleMode;
	settings: DoubanPluginSetting;
	editor?:Editor;
	userComponent: UserComponent;
	netFileHandler: NetFileHandler;
	showAfterCreate?:boolean;
	syncStatusHolder?:SyncStatusHolder;
	action:string;
	outputFolder:string;
}
