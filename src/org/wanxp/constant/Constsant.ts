import {i18nHelper} from "../lang/helper";
import DoubanSearchResultSubject from "../douban/data/model/DoubanSearchResultSubject";

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
export const  ESTIMATE_TIME_PER:number = 2000;

/**
 * 预估每次请求+处理时间长度(慢速模式)
 * @private
 */
export const ESTIMATE_TIME_PER_WITH_REQUEST_SLOW:number = ESTIMATE_TIME_PER + BasicConst.CALL_DOUBAN_DELAY_SLOW + BasicConst.CALL_DOUBAN_DELAY_RANGE_SLOW / 2;

/**
 * 预估每次请求+处理时间长度(正常模式)
 * @private
 */
export const  ESTIMATE_TIME_PER_WITH_REQUEST:number = ESTIMATE_TIME_PER + BasicConst.CALL_DOUBAN_DELAY + BasicConst.CALL_DOUBAN_DELAY_RANGE / 2;

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
	movieTemplateFile= 'movieTemplateFile',
	bookTemplateFile = 'bookTemplateFile',
	musicTemplateFile = 'musicTemplateFile',
	noteTemplateFile = 'noteTemplateFile',
	gameTemplateFile = 'gameTemplateFile',
	teleplayTemplateFile = 'teleplayTemplateFile',
}

export enum SupportType {
	ALL = "ALL",
	MOVIE = 'MOVIE',
	BOOK = 'BOOK',
	MUSIC = 'MUSIC',
	NOTE = 'NOTE',
	GAME = 'GAME',
	TELEPLAY = 'TELEPLAY',
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
	movie= 'movie',
	book= 'book',
	broadcast= 'broadcast',
	note= 'note',
	music= 'music',
}

/**
 * 同步模式选项
 */
// @ts-ignore
export const SyncTypeRecords: { [key in SyncType]: string } = {
	[SyncType.movie]: i18nHelper.getMessage('504103'),
	[SyncType.book]: i18nHelper.getMessage('504102'),
	// [SyncType.broadcast]: i18nHelper.getMessage('504104'),
	// [SyncType.note]: i18nHelper.getMessage('504105'),
	[SyncType.music]: i18nHelper.getMessage('504106'),
}

/**
 * 同步豆瓣每页的大小
 */
export const PAGE_SIZE:number = 30;

/**
 * 多少条后同步速率变慢，防止403
 */



/**
 * 动作
 */
export enum Action {
	SearchAndReplace='SearchAndReplace',
	SearchAndCrate='SearchAndCrate',
	Sync='Sync',
	SearchEditorAndReplace='SearchEditorAndReplace'
}

export enum SyncItemStatus {
	exists= 'exists',
	replace= 'replace',
	create= 'create',
	fail= 'fail',
	unHandle='unHandle',
}
export enum NavigateType {
	previous = "previous",
	next = "next",

	nextNeedLogin = "nextNeedLogin"
}

export const DoubanSearchResultSubjectPreviousPage:DoubanSearchResultSubject = {
	cast: "",
	datePublished: undefined,
	desc: "",
	genre: [],
	id: "",
	image: "",
	publisher: "",
	score: 0,
	title: i18nHelper.getMessage("150102"),
	type: "navigate",
	url: NavigateType.previous
}

export const DoubanSearchResultSubjectNextPage:DoubanSearchResultSubject = {
	cast: "",
	datePublished: undefined,
	desc: "",
	genre: [],
	id: "",
	image: "",
	publisher: "",
	score: 0,
	title: i18nHelper.getMessage("150103"),
	type: "navigate",
	url: NavigateType.next
}

export const DoubanSearchResultSubjectNextPageNeedLogin:DoubanSearchResultSubject = {
	cast: "",
	datePublished: undefined,
	desc: "",
	genre: [],
	id: "",
	image: "",
	publisher: "",
	score: 0,
	title: i18nHelper.getMessage("150104"),
	type: "navigate",
	url: NavigateType.nextNeedLogin
}

export const SEARCH_ITEM_PAGE_SIZE:number = 20;





