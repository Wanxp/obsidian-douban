import {AggregateRating, Person} from 'schema-dts';
import DoubanSubject from './DoubanSubject';


export default class DoubanGameSubject extends DoubanSubject  {
	aliases:string[];
	developer:string;
	platform:string[];
}
