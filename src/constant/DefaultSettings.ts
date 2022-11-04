import {DoubanPluginSetting} from "@App/setting/model/DoubanPluginSetting";
import {PersonNameMode} from "./Constsant";
import {doubanHeaders} from "./Douban";

export const DEFAULT_SETTINGS: DoubanPluginSetting = {
	//以后会被移除
	movieTemplateFile: ``,
	bookTemplateFile: ``,
	musicTemplateFile: ``,
	noteTemplateFile: ``,
	gameTemplateFile: ``,
	teleplayTemplateFile: ``,
	searchUrl: 'https://www.douban.com/search?q=',
	searchHeaders: JSON.stringify(doubanHeaders),
	dateFormat: "yyyy-MM-DD",
	timeFormat: "HH:mm:ss",
	arraySpilt: ", ",
	personNameMode: PersonNameMode.CH_NAME,
	dataFilePath: "",
	dataFileNamePath: "/{{type}}/{{title}}",
	statusBar: true,
}
