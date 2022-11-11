import {CustomProperty} from "@App/setting/model/CustomProperty";

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
	customProperties: CustomProperty[],
	loginCookiesContent: string,
	cacheImage: boolean,
	attachmentPath: string,
}
