import DoubanSubject from 'src/org/wanxp/douban/data/model/DoubanSubject';

export default class DoubanPageBroadcastSubject extends DoubanSubject {
	pageNumber: number;
	broadcast: DoubanPageBroadcastSubject[];
	pageSize: number;
}
