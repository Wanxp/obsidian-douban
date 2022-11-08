import {DoubanSubjectState} from "../../../constant/Constsant";

export interface UserStateSubject {
	tags: string[];
	rate: number;
	state: DoubanSubjectState;
	comment: string;
	collectionDate: Date;
}
