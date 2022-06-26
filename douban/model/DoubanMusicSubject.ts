import {AggregateRating, Person, WithContext} from 'schema-dts';

import DoubanSubject from "./DoubanSubject";

export default class DoubanMusicSubject extends DoubanSubject  {
	actor:string[];
	datePublished:Date;
	image:string;
	genre:string;
	albumType:string;
	medium:string;
	publish:string;
	numberOfRecords:number;
	barcode:string;
	score:number;
}
