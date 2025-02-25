import {i18nHelper} from "../lang/helper";
import DoubanSearchResultSubject from "../douban/data/model/DoubanSearchResultSubject";
import StringUtil from "../utils/StringUtil";
import {DoubanPluginOnlineSettings} from "../douban/setting/model/DoubanPluginOnlineSettings";
import {DataField} from "../utils/model/DataField";

/**
 * 常量池
 */
export const BasicConst = {
	YAML_FRONT_MATTER_SYMBOL: '---',
	/**
	 * 状态栏显示毫秒数
	 */
	CLEAN_STATUS_BAR_DELAY: 5000,
	/**
	 * 请求豆瓣周期(多少秒一次)
	 */
	CALL_DOUBAN_DELAY: 4000,
	/**
	 * 请求豆瓣周期(多少秒一次)
	 */
	CALL_DOUBAN_DELAY_RANGE: 4000,
	/**
	 * 多少条后同步速率变慢，防止403
	 */
	SLOW_SIZE: 200,

	/**
	 * 请求豆瓣周期(多少秒一次) 慢速模式
	 */
	CALL_DOUBAN_DELAY_SLOW: 10000,
	/**
	 * 请求豆瓣周期(多少秒一次)
	 */
	CALL_DOUBAN_DELAY_RANGE_SLOW: 5000,

}

/**
 * 预估程序处理时间长度
 * @private
 */
export const ESTIMATE_TIME_PER: number = 2000;

/**
 * 预估每次请求+处理时间长度(慢速模式)
 * @private
 */
export const ESTIMATE_TIME_PER_WITH_REQUEST_SLOW: number = ESTIMATE_TIME_PER + BasicConst.CALL_DOUBAN_DELAY_SLOW + BasicConst.CALL_DOUBAN_DELAY_RANGE_SLOW / 2;

/**
 * 预估每次请求+处理时间长度(正常模式)
 * @private
 */
export const ESTIMATE_TIME_PER_WITH_REQUEST: number = ESTIMATE_TIME_PER + BasicConst.CALL_DOUBAN_DELAY + BasicConst.CALL_DOUBAN_DELAY_RANGE / 2;


/**
 * 模板类型
 */
export enum TemplateTextMode {
	NORMAL,
	YAML,
}

/**
 * 搜索结果处理模式
 */
export enum SearchHandleMode {
	/**
	 * 为了替换当前文档
	 */
	FOR_REPLACE,
	/**
	 * 为了创建文档
	 */
	FOR_CREATE,
}

/**
 * 名称模式
 */
export enum PersonNameMode {
	CH_NAME = "CH",
	EN_NAME = "EN",
	CH_EN_NAME = "CH_EN",
}

/**
 * 模板的key
 *
 */
export enum TemplateKey {
	movieTemplateFile = 'movieTemplateFile',
	bookTemplateFile = 'bookTemplateFile',
	musicTemplateFile = 'musicTemplateFile',
	noteTemplateFile = 'noteTemplateFile',
	gameTemplateFile = 'gameTemplateFile',
	teleplayTemplateFile = 'teleplayTemplateFile',
}

export enum SupportType {
	ALL = "all",
	MOVIE = 'movie',
	BOOK = 'book',
	MUSIC = 'music',
	NOTE = 'note',
	GAME = 'game',
	TELEPLAY = 'teleplay',
	THEATER = 'theater',
}

export enum PropertyName {
	//base
	id = "id",
	title = "title",
	type = "type",
	score = "score",
	image = "image",
	imageUrl = "imageUrl",
	url = "url",
	desc = "desc",
	publisher = "publisher",
	datePublished = "datePublished",
	genre = "genre",

	//user
	tags = "tags",
	rate = "rate",
	state = "state",
	collectionDate = "collectionDate",
	comment = "comment",


	//book
	author = "author",
	translator = "translator",
	isbn = "isbn",
	originalTitle = "originalTitle",
	subTitle = "subTitle",
	totalPage = "totalPage",
	series = "series",
	menu = "menu",
	price = "price",
	binding = "binding",
	producer = "producer",

	//movie
	director = "director",
	actor = "actor",
	aggregateRating = "aggregateRating",
	aliases = "aliases",
	country = "country",
	language = "language",
	time = "time",
	IMDb = "IMDb",

	//music
	albumType = "albumType",
	medium = "medium",
	records = "records",
	barcode = "barcode",

	//game
	platform = "platform",
	developer = "developer",


	//teleplay
	episode = "episode",

	//theater


	//note
	authorUrl = "authorUrl",
	content = "content",
}

/**
 * 名称模式选项
 */
// @ts-ignore
export const SearchTypeRecords: { [key in SupportType]: string } = {
	[SupportType.ALL]: i18nHelper.getMessage('ALL'),
	[SupportType.MOVIE]: i18nHelper.getMessage('MOVIE_AND_TELEPLAY'),
	[SupportType.BOOK]: i18nHelper.getMessage('BOOK'),
	[SupportType.MUSIC]: i18nHelper.getMessage('MUSIC'),
	[SupportType.NOTE]: i18nHelper.getMessage('NOTE'),
	[SupportType.GAME]: i18nHelper.getMessage('GAME'),
	// [SupportType.THEATER]: i18nHelper.getMessage('THEATER'),
}

/**
 * 名称模式选项
 */
export const PersonNameModeRecords: { [key in PersonNameMode]: string } = {
	[PersonNameMode.CH_NAME]: i18nHelper.getMessage('121206'),
	[PersonNameMode.EN_NAME]: i18nHelper.getMessage('121207'),
	[PersonNameMode.CH_EN_NAME]: i18nHelper.getMessage('121208'),
}

export enum SyncType {
	movie = 'movie',
	book = 'book',
	broadcast = 'broadcast',
	note = 'note',
	music = 'music',
	teleplay = 'teleplay'
}

export const SyncTypeUrlDomain: Map<SyncType, string> = new Map([
	[SyncType.movie , 'movie'],
	[SyncType.book , 'book'],
	[SyncType.broadcast , 'broadcast'],
	[SyncType.note , 'note'],
	[SyncType.music , 'music'],
	[SyncType.teleplay , 'movie']]
)

/**
 * 同步模式选项
 */
// @ts-ignore
export const SyncTypeRecords: { [key in SyncType]: string } = {
	[SyncType.movie]: i18nHelper.getMessage('504103'),
	[SyncType.teleplay]: i18nHelper.getMessage('504107'),
	[SyncType.book]: i18nHelper.getMessage('504102'),
	// [SyncType.broadcast]: i18nHelper.getMessage('504104'),
	// [SyncType.note]: i18nHelper.getMessage('504105'),
	[SyncType.music]: i18nHelper.getMessage('504106'),
}

/**
 * 同步豆瓣每页的大小
 */
export const PAGE_SIZE: number = 30;

/**
 * 多少条后同步速率变慢，防止403
 */


/**
 * 动作
 */
export enum Action {
	SearchAndReplace = 'SearchAndReplace',
	SearchAndCrate = 'SearchAndCrate',
	Sync = 'Sync',
	SearchEditorAndReplace = 'SearchEditorAndReplace'
}

export enum SyncItemStatus {
	exists = 'exists',
	replace = 'replace',
	create = 'create',
	fail = 'fail',
	unHandle = 'unHandle',
}

export enum NavigateType {
	previous = "previous",
	next = "next",

	nextNeedLogin = "nextNeedLogin"
}

export const DoubanSearchResultSubjectPreviousPage: DoubanSearchResultSubject = {
	cast: "",
	datePublished: undefined,
	desc: "",
	genre: [],
	id: "",
	image: "",
	imageUrl: "",
	publisher: "",
	score: 0,
	title: i18nHelper.getMessage("150102"),
	type: "navigate",
	url: NavigateType.previous
}

export const DoubanSearchGroupPublishResultSubjectPreviousPage: DoubanSearchResultSubject = {
	cast: "",
	datePublished: undefined,
	desc: "",
	genre: [],
	id: "",
	image: "",
	imageUrl: "",
	publisher: "",
	score: 0,
	title: i18nHelper.getMessage("150106"),
	type: "navigate",
	url: NavigateType.previous
}

export const DoubanSearchGroupPublishResultSubjectNextPage: DoubanSearchResultSubject = {
	cast: "",
	datePublished: undefined,
	desc: "",
	genre: [],
	id: "",
	image: "",
	imageUrl: "",
	publisher: "",
	score: 0,
	title: i18nHelper.getMessage("150105"),
	type: "navigate",
	url: NavigateType.next
}

export const DoubanSearchResultSubjectNextPage: DoubanSearchResultSubject = {
	cast: "",
	datePublished: undefined,
	desc: "",
	genre: [],
	id: "",
	image: "",
	imageUrl: "",
	publisher: "",
	score: 0,
	title: i18nHelper.getMessage("150103"),
	type: "navigate",
	url: NavigateType.next
}

export const DoubanSearchResultSubjectNextPageNeedLogin: DoubanSearchResultSubject = {
	cast: "",
	datePublished: undefined,
	desc: "",
	genre: [],
	id: "",
	image: "",
	imageUrl: "",
	publisher: "",
	score: 0,
	title: i18nHelper.getMessage("150104"),
	type: "navigate",
	url: NavigateType.nextNeedLogin
}

export const SEARCH_ITEM_PAGE_SIZE: number = 20;

/**
 * 豆瓣默认请求头
 * @type {string}
 **/
export const DEFAULT_DOUBAN_HEADERS = StringUtil.parseHeaders(`
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Accept-Language: zh-CN,zh;q=0.9
Cache-Control: max-age=0
Connection: keep-alive
Host: www.douban.com
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: none
Sec-Fetch-User: ?1
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
sec-ch-ua: "Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
`)

/**
 * 属性设置
 */
export const ONLINE_SETTING_DEFAULT: DoubanPluginOnlineSettings = {
	properties: [
		{
			type: SupportType.BOOK,
			name: PropertyName.comment,
			selectors: ['#interest_sect_level > div > span:nth-child(7)'
			]
		},
		{
			type: SupportType.MOVIE,
			name: PropertyName.comment,
			selectors: ['#interest_sect_level > div > span:nth-child(8)',
				'#interest_sect_level > div > span:nth-child(7)',
				'#interest_sect_level > div > span:nth-child(9)'
			]
		}
	]
}

/**
 * 处理状态
 */
export enum SubjectHandledStatus {
	init = 'init',
	saved = 'saved',
	syncTypeDiffAbort = 'syncTypeDiffAbort',
}

export const DEFAULT_SETTINGS_ARRAY_INPUT_SIZE = 2;


export enum DataValueType {
	date,
	number,
	string,
	person,
	array,
	url,
	path,
}

export enum DataTargetType {
	fileName,
	yaml,
	content,
}

export const EXAMPLE_RATE = 8.5;
export const EXAMPLE_RATE_MAX = 10;

export const EXAMPLE_SUBJECT_MAP: Map<string, DataField> = new Map([
	["id", new DataField("id", DataValueType.string, DataValueType.string, "2253379")],
	["title", new DataField("title", DataValueType.string, DataValueType.string, "简爱")],
	["type", new DataField("type", DataValueType.string, DataValueType.string, "book")],
	["score", new DataField("score", DataValueType.number, DataValueType.number, EXAMPLE_RATE)],
	["image", new DataField("image", DataValueType.url, DataValueType.url, "https://img9.doubanio.com/view/subject/s/public/s1070959.jpg")],
	["imageUrl", new DataField("imageUrl", DataValueType.url, DataValueType.url, "https://img9.doubanio.com/view/subject/s/public/s1070959.jpg")],
	["url", new DataField("url", DataValueType.url, DataValueType.url, "https://book.douban.com/subject/2253379/")],
	["desc", new DataField("desc", DataValueType.string, DataValueType.string, "简爱是一部关于爱、关于成长、关于追求自由与尊严的伟大小说。")],
	["publisher", new DataField("publisher", DataValueType.string, DataValueType.string, "人民文学出版社")],
	["datePublished", new DataField("datePublished", DataValueType.date, DataValueType.date, "2020-1-1")],
	["genre", new DataField("genre", DataValueType.array, DataValueType.array, "小说")],
	["tags", new DataField("tags", DataValueType.array, DataValueType.array, "小说")],
	["rate", new DataField("rate", DataValueType.number, DataValueType.number, 9.0)],
	["state", new DataField("state", DataValueType.string, DataValueType.string, "wish")],
	["collectionDate", new DataField("collectionDate", DataValueType.date, DataValueType.date, "2020-1-1")],
	["comment", new DataField("comment", DataValueType.string, DataValueType.string, "简爱是一部关于爱、关于成长、关于追求自由与尊严的伟大小说。")],
	["author", new DataField("author", DataValueType.person, DataValueType.person, "夏洛蒂·勃朗特")],
	["translator", new DataField("translator", DataValueType.person, DataValueType.person, "李继宏")],
]);

export const MAX_STAR_NUMBER = 100;

export enum PictureBedType {
	PicGo = "PicGo"
}

export const PictureBedSetting_PicGo ={
	url: "http://127.0.0.1:36677/upload"
}

export const PictureBedTypeRecords: { [key in PictureBedType]: string } = {
	[PictureBedType.PicGo]: PictureBedType.PicGo
}


export enum SyncConditionType {
	/**
	 * 最近新变动
	 */
	ALL = "all",
	/**
	 * 最近新变动
	 */
	LAST_UPDATE = "lastUpdate",

	/**
	 * 最近10条
	 */
	LAST_TEN = "lastTen",

	/**
	 * 自定义时间
	 */
	CUSTOM_TIME = "customTime",

	/**
	 * 自定义条数
	 */
	CUSTOM_ITEM = "customItem",

}

/**
 * 名称模式选项
 */
// @ts-ignore
export const SyncConditionTypeRecords: { [key in SyncConditionType]: string } = {
	[SyncConditionType.ALL]: i18nHelper.getMessage('110071'),
	[SyncConditionType.LAST_UPDATE]: i18nHelper.getMessage('110072'),
	[SyncConditionType.LAST_TEN]: i18nHelper.getMessage('110075'),
	[SyncConditionType.CUSTOM_ITEM]: i18nHelper.getMessage('110076'),
	[SyncConditionType.CUSTOM_TIME]: i18nHelper.getMessage('110074'),

}