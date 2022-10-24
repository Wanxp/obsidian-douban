import {AggregateRating, Person, WithContext} from 'schema-dts';

import DoubanSubject from 'src/douban/data/model/DoubanSubject';

export default class DoubanPageBroadcastSubject extends DoubanSubject {
	pageNumber:number;
	broadcast:DoubanPageBroadcastSubject[];
	pageSize:number;
}
