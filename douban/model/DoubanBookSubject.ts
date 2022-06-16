import {AggregateRating, Person, WithContext} from 'schema-dts';

import DoubanSubject from "./DoubanSubject";

export default class DoubanMovieSubject extends DoubanSubject  {
	author:Person[];
	aggregateRating:AggregateRating;
	datePublished:Date;
	image:string
}
