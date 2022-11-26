import {AggregateRating, Person} from 'schema-dts';

import DoubanSubject from "./DoubanSubject";

export default class DoubanMovieSubject extends DoubanSubject {
	director: Person[];
	author: Person[];
	actor: Person[];
	aggregateRating: AggregateRating;
	originalTitle: string;
	aliases: string[];
	language: string[];
	country: string[];
	time: string;
	IMDb: string;
}
