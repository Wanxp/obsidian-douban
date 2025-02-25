export interface  SyncConfig {
	syncType: string,
	syncConditionType: string,
	syncConditionCountFromValue: string,
	syncConditionCountToValue: string,
	syncConditionDateFromValue: string,
	syncConditionDateToValue: string,
	scope: string,
	force: boolean,
	dataFilePath: string;
	dataFileNamePath: string;
	cacheImage:boolean;

	cacheHighQuantityImage:boolean;
	attachmentPath: string;
	templateFile: string;
	incrementalUpdate: boolean;
}
