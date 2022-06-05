import DoubanSubject from "./DoubanSubject";
import {AggregateRating, Person, WithContext} from 'schema-dts';


export default class DoubanMovieSubject extends DoubanSubject  {
	director:Person[];
	author:Person[];
	actor:Person[];
	aggregateRating:AggregateRating;
	datePublished:string;
	image:string
}
