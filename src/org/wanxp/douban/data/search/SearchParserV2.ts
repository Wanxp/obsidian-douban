import DoubanSearchResultSubject from "../model/DoubanSearchResultSubject";

export default class SearchParserHandlerV2 {

	static itemMapToSearchResult(items:any):DoubanSearchResultSubject[] {
		if (!items) {
			return [];
		}
		return items.map((i: any) => {
			const target:any = i.target;
			const result: DoubanSearchResultSubject = {
				id: target.id ??'',
				title: target.title ?? '-',
				score: target.rating && target.rating.value ? Number(target.rating.value) : null,
				cast: target.card_subtitle?? '',
				type: i.type_name ??  '-',
				desc: '-',
				url: target.uri? (target.uri.replaceAll('douban://', 'https://')) :  'https://www.douban.com',
				image: "",
				imageUrl: "",
				publisher: "",
				datePublished: undefined,
				genre: []
			};
			return result;
		})
	}

}
