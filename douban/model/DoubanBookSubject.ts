import {AggregateRating, Person, WithContext} from 'schema-dts';

import DoubanSubject from "./DoubanSubject";

export default class DoubanMovieSubject extends DoubanSubject  {
	author:string;
	translator:string;
	bookType:string;
	image:string;
	publishDate:string;
	totalWord:number;
	isbn:string;
	press:string;
	score:number;
	originalName:string;
	totalPage:number
	belong:string;
	menu:string;
}
