import {SearchHandleMode} from "../../../constant/Constsant";
import {Editor} from "obsidian";
import { DoubanPluginSetting } from "@App/setting/model/DoubanPluginSetting";
import UserComponent from "@App/user/UserComponent";

export default interface HandleContext {
	mode:SearchHandleMode;
	settings: DoubanPluginSetting;
	editor?:Editor;
	userComponent: UserComponent;
}
