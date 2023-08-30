import {CheerioAPI} from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanBookSubject, {DoubanBookParameter} from "../model/DoubanBookSubject";
import DoubanPlugin from "../../../main";
import DoubanSubject from "../model/DoubanSubject";
import {SupportType, TemplateTextMode} from "../../../constant/Constsant";
import HandleContext from "../model/HandleContext";
import StringUtil from "../../../utils/StringUtil";
import {UserStateSubject} from "../model/UserStateSubject";
import {moment} from "obsidian";

export default class DoubanBookLoadHandler extends DoubanAbstractLoadHandler<DoubanBookSubject> {

	constructor(doubanPlugin: DoubanPlugin) {
		super(doubanPlugin);
	}

	getSupportType(): SupportType {
		return SupportType.BOOK;
	}

	getHighQuantityImageUrl(fileName:string):string{
		return `https://img9.doubanio.com/view/subject/l/public/${fileName}`;
	}

	parseText(beforeContent: string, extract: DoubanBookSubject, context: HandleContext, textMode: TemplateTextMode): string {
		return beforeContent
			.replaceAll(DoubanBookParameter.author,
				super.handleSpecialContent(
					extract.author.map(this.handleSpecialAuthorName), textMode, context))
			.replaceAll(DoubanBookParameter.translator, super.handleSpecialContent(extract.translator, textMode, context))
			.replaceAll(DoubanBookParameter.isbn, extract.isbn)
			.replaceAll(DoubanBookParameter.originalTitle, super.handleSpecialContent(extract.originalTitle, textMode))
			.replaceAll(DoubanBookParameter.subTitle, super.handleSpecialContent(extract.subTitle, textMode))
			.replaceAll(DoubanBookParameter.totalPage, super.handleSpecialContent(extract.totalPage, textMode))
			.replaceAll(DoubanBookParameter.menu, extract.menu.join('\n'))
			.replaceAll(DoubanBookParameter.price, super.handleSpecialContent(extract.price, textMode))
			.replaceAll(DoubanBookParameter.series, super.handleSpecialContent(extract.series, textMode))
			.replaceAll(DoubanBookParameter.binding, super.handleSpecialContent(extract.binding, textMode))
			.replaceAll(DoubanBookParameter.producer, super.handleSpecialContent(extract.producer, textMode))
			;
	}

	support(extract: DoubanSubject): boolean {
		return extract && extract.type && (extract.type.contains("书籍") || extract.type.contains("Book") || extract.type.contains("book"));
	}

	handleSpecialAuthorName(authorName: string): string {
		return authorName.replace(/\[/g, '')
			.replace(']', '/');
	}

	analysisUser(html: CheerioAPI, context: HandleContext): {data:CheerioAPI ,  userState: UserStateSubject} {
		let rate = html('input#n_rating').val();
		let tagsStr = html('span#rating').next().text().trim();
		let tags = tagsStr ? tagsStr.replace('标签:', '').trim().split(' ') : null;
		let stateWord = html('div#interest_sect_level > div.a_stars > span.mr10').text().trim();
		let collectionDateStr = html('div#interest_sect_level > div.a_stars > span.mr10').next().text().trim();
		let userState1 = DoubanAbstractLoadHandler.getUserState(stateWord);
		let component = html('span#rating').next().next().next().text().trim();


		const userState: UserStateSubject = {
			tags: tags,
			rate: rate?Number(rate):null,
			state: userState1,
			collectionDate: collectionDateStr?moment(collectionDateStr, 'YYYY-MM-DD').toDate():null,
			comment: component
		}
		return {data: html, userState: userState};
	}


	parseSubjectFromHtml(html: CheerioAPI, context: HandleContext): DoubanBookSubject {
		let desc = html(html("head > meta[property= 'og:description']").get(0)).attr("content");
		let image = html(html("head > meta[property= 'og:image']").get(0)).attr("content");
		let item = html(html("head > script[type='application/ld+json']").get(0)).text();
		item = super.html_decode(item);
		let obj = JSON.parse(item.replace(/[\r\n\s+]/g, ''));
		let title = obj.name;
		let url = obj.url;
		let author = obj.author.map((a: any) => a.name);
		let isbn = obj.isbn;


		let score = html(html("#interest_sectl > div > div.rating_self.clearfix > strong[property= 'v:average']").get(0)).text();
		let detailDom = html(html("#info").get(0));
		let publish = detailDom.find("span.pl");

		let valueMap = new Map<string, any>();

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
			type: "Book",
			title: title,
			desc: desc,
			url: url,
			genre: [],
			binding: valueMap.has('binding') ? valueMap.get('binding') : "",
			producer: valueMap.has('producer') ? valueMap.get('producer') : "",
		};
		return result;
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
