import {AggregateRating, Person, WithContext} from 'schema-dts';

import DoubanSubject from "./DoubanSubject";

export default class DoubanBookSubject extends DoubanSubject  {
	author:string[];
	translator:string[];
	bookType:string;
	totalWord:number;
	isbn:string;
	originalTitle:string;
	subTitle:string;
	totalPage:number
	belong:string;
	menu:string[];
	price:number;
	labels:string[];
}
