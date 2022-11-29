import {CustomProperty} from "./CustomProperty";
import {SyncConfig} from "../../sync/model/SyncConfig";
import {HandleKey} from "../../sync/model/HandledKey";
import {HandleValue} from "../../sync/model/HandleValue";

export interface DoubanPluginSetting {
	movieTemplateFile: string,
	bookTemplateFile: string,
	musicTemplateFile: string,
	noteTemplateFile: string,
	gameTemplateFile: string,
	teleplayTemplateFile: string,
	dateFormat: string,
	timeFormat: string,
	searchUrl: string,
	arraySpilt: string,
	searchHeaders?: string,
	personNameMode: string,
	dataFilePath: string,
	dataFileNamePath: string,
	statusBar: boolean,
	debugMode: boolean,
	customProperties: CustomProperty[],
	loginCookiesContent: string,
	cacheImage: boolean,
	attachmentPath: string,
	syncHandledData?:Map<HandleKey, Set<HandleValue>>,
}
