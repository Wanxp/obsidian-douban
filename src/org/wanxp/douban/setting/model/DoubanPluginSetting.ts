import {CustomProperty} from "./CustomProperty";
import {SyncHandledData} from "./SyncHandledData";

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
	cacheHighQuantityImage: boolean,

	attachmentPath: string,
	syncHandledDataArray: SyncHandledData[],
}
