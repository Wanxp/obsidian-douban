import {i18nHelper} from "../lang/helper";

/**
 * 常量池
 */
export const BasicConst = {
	YAML_FRONT_MATTER_SYMBOL: '---',
	CLEAN_STATUS_BAR_DELAY: 5000,
	CALL_DOUBAN_DELAY: 3000,
	CALL_DOUBAN_DELAY_RANGE: 3000,
}

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


export const PAGE_SIZE:number = 30;

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
}

