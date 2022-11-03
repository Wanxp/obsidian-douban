import {SearchHandleMode} from "../../../constant/Constsant";
import {Editor} from "obsidian";
import { DoubanPluginSetting } from "@App/setting/model/DoubanPluginSetting";

export default interface HandleContext {
	mode:SearchHandleMode;
	settings: DoubanPluginSetting;
	editor?:Editor;
}
