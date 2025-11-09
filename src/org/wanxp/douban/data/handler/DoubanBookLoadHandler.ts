import {CheerioAPI} from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanBookSubject, {DoubanBookParameter} from "../model/DoubanBookSubject";
import DoubanPlugin from "../../../main";
import DoubanSubject from "../model/DoubanSubject";
import {DataValueType, PropertyName, SupportType, TemplateTextMode} from "../../../constant/Constsant";
import HandleContext from "../model/HandleContext";
import StringUtil from "../../../utils/StringUtil";
import {UserStateSubject} from "../model/UserStateSubject";
import {moment} from "obsidian";
import {DataField} from "../../../utils/model/DataField";

export default class DoubanBookLoadHandler extends DoubanAbstractLoadHandler<DoubanBookSubject> {

	constructor(doubanPlugin: DoubanPlugin) {
		super(doubanPlugin);
	}

	getSupportType(): SupportType {
		return SupportType.book;
	}

	getHighQuantityImageUrl(fileName:string):string{
		return `https://img9.doubanio.com/view/subject/l/public/${fileName}`;
	}

	getSubjectUrl(id:string):string{
		return `https://book.douban.com/subject/${id}/`;
	}

	parseVariable(beforeContent: string, variableMap:Map<string, DataField>, extract: DoubanBookSubject, context: HandleContext): void {
		variableMap.set(DoubanBookParameter.author, new DataField(DoubanBookParameter.author,
			DataValueType.array, extract.author, extract.author.map(this.handleSpecialAuthorName)));
		variableMap.set(DoubanBookParameter.translator, new DataField(DoubanBookParameter.translator,
			DataValueType.array, extract.translator, extract.translator.map(this.handleSpecialAuthorName)));
	}

	support(extract: DoubanSubject): boolean {
		return extract && extract.type && (extract.type.contains("图书") || extract.type.contains("书籍") || extract.type.contains("Book") || extract.type.contains("book"));
	}

	handleSpecialAuthorName(authorName: string): string {
		return authorName.replace(/\[/g, '')
			.replace(']', '/');
	}

	analysisUser(html: CheerioAPI, context: HandleContext): {data:CheerioAPI ,  userState: UserStateSubject} {
		const rate = html('input#n_rating').val();
		const tagsStr = html('span#rating').next().text().trim();
		const tags = tagsStr ? tagsStr.replace('标签:', '').trim().split(' ') : null;
		const stateWord = html('div#interest_sect_level > div.a_stars > span.mr10').text().trim();
		const collectionDateStr = html('div#interest_sect_level > div.a_stars > span.mr10').next().text().trim();
		const userState1 = DoubanAbstractLoadHandler.getUserState(stateWord);
		const comment = this.getComment(html);


		const userState: UserStateSubject = {
			tags: tags,
			rate: rate?Number(rate):null,
			state: userState1,
			collectionDate: collectionDateStr?moment(collectionDateStr, 'YYYY-MM-DD').toDate():null,
			comment: comment
		}
		return {data: html, userState: userState};
	}


	parseSubjectFromHtml(html: CheerioAPI, context: HandleContext): DoubanBookSubject {
		let desc = html(".intro p").text();
		if (!desc) {
			desc = html(html("head > meta[property= 'og:description']").get(0)).attr("content");
		}
		const image = html(html("head > meta[property= 'og:image']").get(0)).attr("content");
		let item = html(html("head > script[type='application/ld+json']").get(0)).text();
		item = super.html_decode(item);
		const obj = JSON.parse(item.replace(/[\r\n\t\s+]/g, ''));
		const title = obj.name;
		const url = obj.url;
		const author = obj.author.map((a: any) => a.name);
		const isbn = obj.isbn;


		const score = html(html("#interest_sectl > div > div.rating_self.clearfix > strong[property= 'v:average']").get(0)).text();
		const detailDom = html(html("#info").get(0));
		const publish = detailDom.find("span.pl");

		const valueMap = new Map<string, any>();

		publish.map((index, info) => {
			let key = html(info).text().trim();
			let value;
			if (key.indexOf('译者') >= 0) {
				value = [];
				html(info.parent).find("a").map((index, a) => {
					value.push(html(a).text().trim());
				});
			} else if (key.indexOf('作者') >= 0 || key.indexOf('丛书') >= 0 || key.indexOf('出版社') >= 0 || key.indexOf('出品方') >= 0) {
				value = html(info.next.next).text().trim();
			} else {
				value = html(info.next).text().trim();
			}
			valueMap.set(BookKeyValueMap.get(key), value);
		})
		let id = StringUtil.analyzeIdByUrl(url);
		let menuIdDom = html('#dir_' + id + '_full') ? html('#dir_' + id + '_full') : html('#dir_' + id + '_short');
		let menu: string[] = menuIdDom ? html(menuIdDom.get(0)).text().trim().split('\n').map(row => row.trim()) : [];
		menu.length > 0 ? menu.pop() : menu;
		const result: DoubanBookSubject = {
			author: author,
			translator: valueMap.has('translator') ? valueMap.get('translator') : [],
			image: image,
			imageUrl: image,
			datePublished: valueMap.has('datePublished') ? new Date(valueMap.get('datePublished')) : undefined,
			isbn: isbn,
			publisher: valueMap.has('publisher') ? valueMap.get('publisher') : "",
			score: Number(score),
			originalTitle: valueMap.has('originalTitle') ? valueMap.get('originalTitle') : "",
			subTitle: valueMap.has('subTitle') ? valueMap.get('subTitle') : "",
			totalPage: valueMap.has('totalPage') ? Number(valueMap.get('totalPage')) : null,
			series: valueMap.has('series') ? valueMap.get('series') : "",
			menu: menu,
			price: valueMap.has('price') ? Number(valueMap.get('price').replace('元', '')) : null,
			id: id,
			type: this.getSupportType(),
			title: title,
			desc: desc,
			url: url,
			genre: [],
			binding: valueMap.has('binding') ? valueMap.get('binding') : "",
			producer: valueMap.has('producer') ? valueMap.get('producer') : "",
		};
		return result;
	}

	private getComment(html: CheerioAPI) {
		let comment = html('span#rating').next().next().next().text().trim();
		if (comment) {
			return comment;
		}
		return this.getPropertyValue(html, PropertyName.comment);
	}



}




const BookKeyValueMap: Map<string, string> = new Map(
	[['作者', 'author'],
		['出版社:', 'publisher'],
		['原作名:', 'originalTitle'],
		['出版年:', 'datePublished'],
		['页数:', 'totalPage'],
		['定价:', 'price'],
		['装帧:', 'binding'],
		['丛书:', 'series'],
		['ISBN:', 'isbn'],
		['译者', 'translator'],
		['副标题:', 'subTitle'],
		['出品方:', 'producer'],
	]
);
