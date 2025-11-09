import {DoubanPluginSetting} from "../douban/setting/model/DoubanPluginSetting";
import {PersonNameMode, PictureBedSetting_PicGo, PictureBedType, SupportType} from "./Constsant";

export const DEFAULT_SETTINGS: DoubanPluginSetting = {
	pictureBedFlag: false,
	pictureBedSetting: PictureBedSetting_PicGo,
	pictureBedType: PictureBedType.PicGo,
	arraySettings: [
		{
			"arrayName": "ArrayType1",
			"arrayStart": "",
			"arrayElementStart": "[[",
			"arraySpiltV2": ",",
			"arrayElementEnd": "]]",
			"arrayEnd": "",
			"index": 1
		}
	],
	onlineSettingsFileName: "obsidian_douban_plugin_online_settings.json",
	onlineSettingsGistId: "35693f9ece9bd6abba98f94e81afde19",
	movieTemplateFile: ``,
	bookTemplateFile: ``,
	musicTemplateFile: ``,
	noteTemplateFile: ``,
	gameTemplateFile: ``,
	teleplayTemplateFile: ``,
	searchUrl: 'https://www.douban.com/search?q=',
	dateFormat: "yyyy-MM-DD",
	timeFormat: "HH:mm:ss",
	arrayStart: "",
	arrayElementStart: "\\n  - ",
	arraySpiltV2: "",
	arrayElementEnd: "",
	arrayEnd: "",
	personNameMode: PersonNameMode.CH_NAME,
	dataFilePath: "",
	dataFileNamePath: "/{{type}}/{{title}}",
	statusBar: true,
	debugMode: false,
	customProperties: [
		{name: 'myType', value: 'movie', field: SupportType.movie},
		{name: 'myType', value: 'book', field: SupportType.book},
		{name: 'myType', value: 'music', field: SupportType.music},
		{name: 'myType', value: 'note', field: SupportType.note},
		{name: 'myType', value: 'game', field: SupportType.game},
		{name: 'myType', value: 'teleplay', field: SupportType.teleplay},
		{name: 'myType', value: 'theater', field: SupportType.theater},
	],
	loginCookiesContent: '',
	loginHeadersContent: '',
	cacheImage: true,
	cacheHighQuantityImage: true,
	attachmentPath: 'assets',
	attachmentFileName: "{{title}}",
	syncHandledDataArray: [],
	// syncLastUpdateTime: new Map<string, string>(),
	scoreSetting: {
		starFull: '⭐',
		starEmpty: '☆',
		displayStarEmpty: false,
		maxStar: 5,
	},
	searchDefaultType: SupportType.all,

}


