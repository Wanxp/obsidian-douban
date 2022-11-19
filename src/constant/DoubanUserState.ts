import {i18nHelper} from "../lang/helper";
import {SupportType} from "./Constsant";

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

export const DoubanSubjectStateRecords: { [key in SupportType]: Record<DoubanSubjectState, string> } = {
	[SupportType.ALL]:DoubanSubjectStateRecords_ALL,
	[SupportType.MOVIE]:DoubanSubjectStateRecords_MOVIE,
	[SupportType.BOOK]:DoubanSubjectStateRecords_BOOK,
	[SupportType.MUSIC]:DoubanSubjectStateRecords_MUSIC,
	[SupportType.NOTE]:DoubanSubjectStateRecords_NOTE,
	[SupportType.GAME]:DoubanSubjectStateRecords_GAME,
	[SupportType.TELEPLAY]:DoubanSubjectStateRecords_TELEPLAY,

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
export const DoubanSubjectStateRecords_BOOK_SYNC: { [key in DoubanSubjectState]: string } = {
	// @ts-ignore
	[ALL]: i18nHelper.getMessage('500004'),
	[DoubanSubjectState.wish]: i18nHelper.getMessage('500302'),
	[DoubanSubjectState.do]: i18nHelper.getMessage('500303'),
	[DoubanSubjectState.collect]: i18nHelper.getMessage('500304'),
}

export const DoubanSubjectStateRecords_BROADCAST_SYNC: { [key :string]: string } = {
	[ALL]: i18nHelper.getMessage('500004'),
}

export const DoubanSubjectStateRecords_NOTE_SYNC: { [key :string]: string } = {
	[ALL]: i18nHelper.getMessage('500004'),
}






