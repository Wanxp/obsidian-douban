import {CustomProperty} from "./CustomProperty";
import {SyncHandledData} from "./SyncHandledData";
import {ArraySetting} from "./ArraySetting";
import {ScoreSetting} from "./ScoreSetting";

export interface DoubanPluginSetting {
	onlineSettingsFileName: string;
	onlineSettingsGistId: string;
	movieTemplateFile: string,
	bookTemplateFile: string,
	musicTemplateFile: string,
	noteTemplateFile: string,
	gameTemplateFile: string,
	teleplayTemplateFile: string,
	dateFormat: string,
	timeFormat: string,
	searchUrl: string,
	arrayStart: string,
	arrayElementStart: string,
	arraySpiltV2: string,
	arrayElementEnd: string,
	arrayEnd: string,
	personNameMode: string,
	dataFilePath: string,
	dataFileNamePath: string,
	statusBar: boolean,
	debugMode: boolean,
	customProperties: CustomProperty[],
	loginCookiesContent: string,
	loginHeadersContent: string,
	cacheImage: boolean,
	cacheHighQuantityImage: boolean,
	attachmentPath: string,
	syncHandledDataArray: SyncHandledData[],
	arraySettings: ArraySetting[],
    scoreSetting: ScoreSetting,
}
