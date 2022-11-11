import {SearchHandleMode} from "../../../constant/Constsant";
import {Editor} from "obsidian";
import { DoubanPluginSetting } from "@App/setting/model/DoubanPluginSetting";
import UserComponent from "@App/user/UserComponent";
import NetFileHandler from "src/net/NetFileHandler";

export default interface HandleContext {
	mode:SearchHandleMode;
	settings: DoubanPluginSetting;
	editor?:Editor;
	userComponent: UserComponent;
	netFileHandler: NetFileHandler;
}
