export interface  SyncConfig {
	syncType: string,
	syncConditionType: string,
	syncConditionCountFromValue: number,
	syncConditionCountToValue: number,
	syncConditionDateFromValue: Date,
	syncConditionDateToValue: Date,
	scope: string,
	force: boolean,
	dataFilePath: string;
	dataFileNamePath: string;
	cacheImage:boolean;

	cacheHighQuantityImage:boolean;
	attachmentPath: string;
	attachmentFileName: string;
	templateFile: string;
	incrementalUpdate: boolean;
}
