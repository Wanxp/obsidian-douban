import DoubanSubject from "./DoubanSubject";

export default class DoubanBookSubject extends DoubanSubject {
	author: string[];
	translator: string[];
	isbn: string;
	originalTitle: string;
	subTitle: string;
	totalPage: number
	series: string;
	menu: string[];
	price: number;
	binding: string;
}

export const DoubanBookParameter = {
	author: '{{author}}',
	translator: '{{translator}}',
	isbn: '{{isbn}}',
	originalTitle: '{{originalTitle}}',
	subTitle: '{{subTitle}}',
	totalPage: '{{totalPage}}',
	series: '{{series}}',
	menu: '{{menu}}',
	price: '{{price}}',
	binding: '{{binding}}',
}
