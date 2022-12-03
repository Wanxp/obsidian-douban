export interface  SyncConfig {
	syncType: string,
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
