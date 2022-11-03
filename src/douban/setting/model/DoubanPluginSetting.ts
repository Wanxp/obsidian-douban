
export interface DoubanPluginSetting {
//==兼容之前的配置
	movieTemplate: string,
	bookTemplate: string,
	musicTemplate: string,
	noteTemplate: string,
	gameTemplate: string,
	teleplayTemplate: string,
//一段时间后会被删除,以上
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

}
