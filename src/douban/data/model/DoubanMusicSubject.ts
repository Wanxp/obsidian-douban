import {AggregateRating, Person, WithContext} from 'schema-dts';

import DoubanSubject from "./DoubanSubject";

export default class DoubanMusicSubject extends DoubanSubject  {
	actor:string[];
	albumType:string;
	medium:string;
	numberOfRecords:number;
	barcode:string;
}
