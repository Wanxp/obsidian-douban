import {AggregateRating, Person, WithContext} from 'schema-dts';

import DoubanSubject from "./DoubanSubject";

export default class DoubanBookSubject extends DoubanSubject  {
	author:string[];
	translator:string[];
	bookType:string;
	image:string;
	datePublished:Date;
	totalWord:number;
	isbn:string;
	publish:string;
	score:number;
	originalTitle:string;
	subTitle:string;
	totalPage:number
	belong:string;
	menu:string[];
	price:number;
	labels:string[];
}
