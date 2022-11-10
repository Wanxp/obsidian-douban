import {i18nHelper} from "../lang/helper";
import {SupportType} from "./Constsant";

export enum DoubanSubjectState {
	HAVE_NOT = 'HAVE_NOT',
	WANTED = 'WANTED',
	DOING = 'DOING',
	DONE = 'DONE',
	UNKNOWN = 'UNKNOWN',
}

export const DoubanSubjectStateRecords_ALL: { [key in DoubanSubjectState]: string } = {
	[DoubanSubjectState.HAVE_NOT]: i18nHelper.getMessage('500101'),
	[DoubanSubjectState.WANTED]: i18nHelper.getMessage('500102'),
	[DoubanSubjectState.DOING]: i18nHelper.getMessage('500103'),
	[DoubanSubjectState.DONE]: i18nHelper.getMessage('500104'),
	[DoubanSubjectState.UNKNOWN]: i18nHelper.getMessage('500000'),
}

export const DoubanSubjectStateRecords_MOVIE: { [key in DoubanSubjectState]: string } = {
	[DoubanSubjectState.HAVE_NOT]: i18nHelper.getMessage('500201'),
	[DoubanSubjectState.WANTED]: i18nHelper.getMessage('500202'),
	[DoubanSubjectState.DOING]: i18nHelper.getMessage('500203'),
	[DoubanSubjectState.DONE]: i18nHelper.getMessage('500204'),
	[DoubanSubjectState.UNKNOWN]: i18nHelper.getMessage('500000'),
}

export const DoubanSubjectStateRecords_BOOK: { [key in DoubanSubjectState]: string } = {
	[DoubanSubjectState.HAVE_NOT]: i18nHelper.getMessage('500301'),
	[DoubanSubjectState.WANTED]: i18nHelper.getMessage('500302'),
	[DoubanSubjectState.DOING]: i18nHelper.getMessage('500303'),
	[DoubanSubjectState.DONE]: i18nHelper.getMessage('500304'),
	[DoubanSubjectState.UNKNOWN]: i18nHelper.getMessage('500000'),
}


export const DoubanSubjectStateRecords_MUSIC: { [key in DoubanSubjectState]: string } = {
	[DoubanSubjectState.HAVE_NOT]: i18nHelper.getMessage('500401'),
	[DoubanSubjectState.WANTED]: i18nHelper.getMessage('500402'),
	[DoubanSubjectState.DOING]: i18nHelper.getMessage('500403'),
	[DoubanSubjectState.DONE]: i18nHelper.getMessage('500404'),
	[DoubanSubjectState.UNKNOWN]: i18nHelper.getMessage('500000'),
}

export const DoubanSubjectStateRecords_NOTE: { [key in DoubanSubjectState]: string } = {
	[DoubanSubjectState.HAVE_NOT]: i18nHelper.getMessage('500501'),
	[DoubanSubjectState.WANTED]: i18nHelper.getMessage('500502'),
	[DoubanSubjectState.DOING]: i18nHelper.getMessage('500503'),
	[DoubanSubjectState.DONE]: i18nHelper.getMessage('500504'),
	[DoubanSubjectState.UNKNOWN]: i18nHelper.getMessage('500000'),
}

export const DoubanSubjectStateRecords_GAME: { [key in DoubanSubjectState]: string } = {
	[DoubanSubjectState.HAVE_NOT]: i18nHelper.getMessage('500601'),
	[DoubanSubjectState.WANTED]: i18nHelper.getMessage('500602'),
	[DoubanSubjectState.DOING]: i18nHelper.getMessage('500603'),
	[DoubanSubjectState.DONE]: i18nHelper.getMessage('500604'),
	[DoubanSubjectState.UNKNOWN]: i18nHelper.getMessage('500000'),
}

export const DoubanSubjectStateRecords_TELEPLAY: { [key in DoubanSubjectState]: string } = {
	[DoubanSubjectState.HAVE_NOT]: i18nHelper.getMessage('500701'),
	[DoubanSubjectState.WANTED]: i18nHelper.getMessage('500702'),
	[DoubanSubjectState.DOING]: i18nHelper.getMessage('500703'),
	[DoubanSubjectState.DONE]: i18nHelper.getMessage('500704'),
	[DoubanSubjectState.UNKNOWN]: i18nHelper.getMessage('500000'),
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
