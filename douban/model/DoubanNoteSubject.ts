import {AggregateRating, Person, WithContext} from 'schema-dts';

import DoubanSubject from "./DoubanSubject";

export default class DoubanNoteSubject extends DoubanSubject  {
	author:string;
	authorUrl:string;
	timePublished:Date;
	image:string;
	content:string;
}
