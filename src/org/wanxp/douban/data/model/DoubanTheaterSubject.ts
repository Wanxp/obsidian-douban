import {AggregateRating, Person} from 'schema-dts';

import DoubanSubject from "./DoubanSubject";

export default class DoubanTheaterSubject extends DoubanSubject {
	director: string[];
	author: string[];
	actor: string[];
	aggregateRating: AggregateRating;
	originalTitle: string;
	aliases: string[];
	language: string[];
}
