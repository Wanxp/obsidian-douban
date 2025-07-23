import {i18nHelper} from "../lang/helper";
import {SupportType, SyncType} from "./Constsant";

export enum DoubanSubjectState {
	not = 'not',
	wish = 'wish',
	do = 'do',
	collect = 'collect',
}

export const DoubanSubjectStateRecords_ALL: { [key in DoubanSubjectState]: string } = {
	[DoubanSubjectState.not]: i18nHelper.getMessage('500101'),
	[DoubanSubjectState.wish]: i18nHelper.getMessage('500102'),
	[DoubanSubjectState.do]: i18nHelper.getMessage('500103'),
	[DoubanSubjectState.collect]: i18nHelper.getMessage('500104'),
}

export const DoubanSubjectStateRecords_MOVIE: { [key in DoubanSubjectState]: string } = {
	[DoubanSubjectState.not]: i18nHelper.getMessage('500201'),
	[DoubanSubjectState.wish]: i18nHelper.getMessage('500202'),
	[DoubanSubjectState.do]: i18nHelper.getMessage('500203'),
	[DoubanSubjectState.collect]: i18nHelper.getMessage('500204'),
}

export const DoubanSubjectStateRecords_BOOK: { [key in DoubanSubjectState]: string } = {
	[DoubanSubjectState.not]: i18nHelper.getMessage('500301'),
	[DoubanSubjectState.wish]: i18nHelper.getMessage('500302'),
	[DoubanSubjectState.do]: i18nHelper.getMessage('500303'),
	[DoubanSubjectState.collect]: i18nHelper.getMessage('500304'),
}


export const DoubanSubjectStateRecords_MUSIC: { [key in DoubanSubjectState]: string } = {
	[DoubanSubjectState.not]: i18nHelper.getMessage('500401'),
	[DoubanSubjectState.wish]: i18nHelper.getMessage('500402'),
	[DoubanSubjectState.do]: i18nHelper.getMessage('500403'),
	[DoubanSubjectState.collect]: i18nHelper.getMessage('500404'),
}

export const DoubanSubjectStateRecords_NOTE: { [key in DoubanSubjectState]: string } = {
	[DoubanSubjectState.not]: i18nHelper.getMessage('500501'),
	[DoubanSubjectState.wish]: i18nHelper.getMessage('500502'),
	[DoubanSubjectState.do]: i18nHelper.getMessage('500503'),
	[DoubanSubjectState.collect]: i18nHelper.getMessage('500504'),
}

export const DoubanSubjectStateRecords_GAME: { [key in DoubanSubjectState]: string } = {
	[DoubanSubjectState.not]: i18nHelper.getMessage('500601'),
	[DoubanSubjectState.wish]: i18nHelper.getMessage('500602'),
	[DoubanSubjectState.do]: i18nHelper.getMessage('500603'),
	[DoubanSubjectState.collect]: i18nHelper.getMessage('500604'),
}

export const DoubanSubjectStateRecords_TELEPLAY: { [key in DoubanSubjectState]: string } = {
	[DoubanSubjectState.not]: i18nHelper.getMessage('500701'),
	[DoubanSubjectState.wish]: i18nHelper.getMessage('500702'),
	[DoubanSubjectState.do]: i18nHelper.getMessage('500703'),
	[DoubanSubjectState.collect]: i18nHelper.getMessage('500704'),
}

export const DoubanSubjectStateRecords_THEATER: { [key in DoubanSubjectState]: string } = {
	[DoubanSubjectState.not]: i18nHelper.getMessage('500701'),
	[DoubanSubjectState.wish]: i18nHelper.getMessage('500702'),
	[DoubanSubjectState.do]: i18nHelper.getMessage('500703'),
	[DoubanSubjectState.collect]: i18nHelper.getMessage('500704'),
}

export const DoubanSubjectStateRecords: { [key in SupportType]: Record<DoubanSubjectState, string> } = {
	[SupportType.all]:DoubanSubjectStateRecords_ALL,
	[SupportType.movie]:DoubanSubjectStateRecords_MOVIE,
	[SupportType.book]:DoubanSubjectStateRecords_BOOK,
	[SupportType.music]:DoubanSubjectStateRecords_MUSIC,
	[SupportType.note]:DoubanSubjectStateRecords_NOTE,
	[SupportType.game]:DoubanSubjectStateRecords_GAME,
	[SupportType.teleplay]:DoubanSubjectStateRecords_TELEPLAY,
	[SupportType.theater]:DoubanSubjectStateRecords_THEATER,

}

export const ALL:string = 'ALL';

// @ts-ignore
export const DoubanSubjectStateRecords_MOVIE_SYNC: { [key in DoubanSubjectState]: string } = {
	// @ts-ignore
	[ALL]: i18nHelper.getMessage('500004'),
	[DoubanSubjectState.wish]: i18nHelper.getMessage('500202'),
	[DoubanSubjectState.do]: i18nHelper.getMessage('500203'),
	[DoubanSubjectState.collect]: i18nHelper.getMessage('500204'),
}

// @ts-ignore
export const DoubanSubjectStateRecords_TELEPLAY_SYNC: { [key in DoubanSubjectState]: string } = {
	// @ts-ignore
	[ALL]: i18nHelper.getMessage('500004'),
	[DoubanSubjectState.wish]: i18nHelper.getMessage('500202'),
	[DoubanSubjectState.do]: i18nHelper.getMessage('500203'),
	[DoubanSubjectState.collect]: i18nHelper.getMessage('500204'),
}

// @ts-ignore
export const DoubanSubjectStateRecords_BOOK_SYNC: { [key in DoubanSubjectState]: string } = {
	// @ts-ignore
	[ALL]: i18nHelper.getMessage('500004'),
	[DoubanSubjectState.wish]: i18nHelper.getMessage('500302'),
	[DoubanSubjectState.do]: i18nHelper.getMessage('500303'),
	[DoubanSubjectState.collect]: i18nHelper.getMessage('500304'),
}

// @ts-ignore
export const DoubanSubjectStateRecords_GAME_SYNC: { [key in DoubanSubjectState]: string } = {
	// @ts-ignore
	// [ALL]: i18nHelper.getMessage('500004'),
	[DoubanSubjectState.wish]: i18nHelper.getMessage('500602'),
	[DoubanSubjectState.do]: i18nHelper.getMessage('500603'),
	[DoubanSubjectState.collect]: i18nHelper.getMessage('500604'),
}

export const DoubanSubjectStateRecords_BROADCAST_SYNC: { [key :string]: string } = {
	[ALL]: i18nHelper.getMessage('500004'),
}

export const DoubanSubjectStateRecords_NOTE_SYNC: { [key :string]: string } = {
	[ALL]: i18nHelper.getMessage('500004'),
}

// @ts-ignore
export const DoubanSubjectStateRecords_MUSIC_SYNC: { [key in DoubanSubjectState]: string } = {
	// @ts-ignore
	[ALL]: i18nHelper.getMessage('500004'),
	[DoubanSubjectState.wish]: i18nHelper.getMessage('500402'),
	[DoubanSubjectState.do]: i18nHelper.getMessage('500403'),
	[DoubanSubjectState.collect]: i18nHelper.getMessage('500404'),
}

// @ts-ignore
export const DoubanSubjectStateRecords_SYNC: { [key in SyncType]: Record<DoubanSubjectState, string> } = {
	[SyncType.movie]:DoubanSubjectStateRecords_MOVIE_SYNC,
	[SyncType.book]:DoubanSubjectStateRecords_BOOK_SYNC,
	[SyncType.music]:DoubanSubjectStateRecords_MUSIC_SYNC,
	// [SyncType.note]:DoubanSubjectStateRecords_NOTE_SYNC,
	[SyncType.game]:DoubanSubjectStateRecords_GAME_SYNC,
	[SyncType.teleplay]:DoubanSubjectStateRecords_TELEPLAY_SYNC,
	// [SyncType.theater]:DoubanSubjectStateRecords_THEATER_SYNC,
}



export const DoubanSubjectStateRecords_KEY_WORD_TYPE: Map<string, SupportType> = new Map<string, SupportType> (
	[['我看过这部电视剧', SupportType.teleplay],
	['我最近看过这部电视剧', SupportType.teleplay],
	['我想看这部电视剧', SupportType.teleplay],
	['我在看这部电视剧', SupportType.teleplay],
	['我最近在看这部电视剧', SupportType.teleplay],

	['我最近看过这部电影', SupportType.movie],
	['我看过这部电影', SupportType.movie],
	['我想看这部电影', SupportType.movie],

	['我读过这本书', SupportType.book],
	['我想读这本书', SupportType.book],
	['我在读这本书', SupportType.book],
	['我最近在读这本书', SupportType.book],

	['我最近听过这张唱片', SupportType.music],
	['我听过这张唱片', SupportType.music],
	['我想听这张唱片', SupportType.music],
	['我在听这张唱片', SupportType.music],
	['我最近在听这张唱片', SupportType.music],

	['我最近玩过这个游戏', SupportType.game],
	['我玩过这个游戏', SupportType.game],
	['我想玩这个游戏', SupportType.game],
	['我在玩这个游戏', SupportType.game],
	['我最近在玩这个游戏', SupportType.game],

		['我最近看过这部电影', SupportType.movie],
		['我看过这部电影', SupportType.movie],
		['我想看这部电影', SupportType.movie],
	]
)





