import SettingsManager from "@App/setting/SettingsManager";
import { DoubanPluginSetting } from "./DoubanPluginSetting";

export interface CreateTemplateSelectParams {
	// @ts-ignore
	name:string,
	desc:string,
	placeholder:string,
	key: keyof DoubanPluginSetting;
	manager: SettingsManager;
}
