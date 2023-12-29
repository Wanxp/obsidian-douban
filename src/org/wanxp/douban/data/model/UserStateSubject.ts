import { DoubanSubjectState } from "src/org/wanxp/constant/DoubanUserState";

export interface UserStateSubject {
	tags: string[];
	rate: number;
	state: DoubanSubjectState;
	comment: string;
	collectionDate: Date;
}

export const DoubanUserParameter = {
	MY_TAGS: '{{myTags}}',
	MY_RATING: '{{myRating}}',
	MY_STATE: '{{myState}}',
	MY_COMMENT: '{{myComment}}',
	MY_COLLECTION_DATE: '{{myCollectionDate}}',
}

export const DoubanUserParameterName = {
	MY_TAGS: 'myTags',
	MY_RATING: 'myRating',
	MY_RATING_STAR: 'myRatingStar',
	MY_STATE: 'myState',
	MY_COMMENT: 'myComment',
	MY_COLLECTION_DATE: 'myCollectionDate',
}
