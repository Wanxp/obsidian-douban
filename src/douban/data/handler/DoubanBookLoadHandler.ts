import {CheerioAPI} from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanBookSubject, {DoubanBookParameter} from "../model/DoubanBookSubject";
import DoubanPlugin from "main";
import {DoubanPluginSettings} from "src/douban/Douban";
import DoubanSubject from "../model/DoubanSubject";
import {TemplateTextMode} from "../../../constant/Constsant";

export default class DoubanBookLoadHandler extends DoubanAbstractLoadHandler<DoubanBookSubject> {

	constructor(doubanPlugin: DoubanPlugin) {
		super(doubanPlugin);
	}

	getTemplate(settings: DoubanPluginSettings): string {
		return settings.bookTemplate;
	}

	parseText(beforeContent: string, extract: DoubanBookSubject, settings: DoubanPluginSettings, textMode: TemplateTextMode): string {
		return beforeContent
			.replaceAll(DoubanBookParameter.author,
				super.handleSpecialContent(
					extract.author.map(this.handleSpecialAuthorName), textMode, settings))
			.replaceAll(DoubanBookParameter.translator, super.handleSpecialContent(extract.translator, textMode, settings))
			.replaceAll(DoubanBookParameter.isbn, extract.isbn)
			.replaceAll(DoubanBookParameter.originalTitle, super.handleSpecialContent(extract.originalTitle, textMode))
			.replaceAll(DoubanBookParameter.subTitle, super.handleSpecialContent(extract.subTitle, textMode))
			.replaceAll(DoubanBookParameter.totalPage, super.handleSpecialContent(extract.totalPage, textMode))
			.replaceAll(DoubanBookParameter.menu, extract.menu.join('\n'))
			.replaceAll(DoubanBookParameter.price, super.handleSpecialContent(extract.price, textMode))
			.replaceAll(DoubanBookParameter.series, super.handleSpecialContent(extract.series, textMode))
			.replaceAll(DoubanBookParameter.binding, super.handleSpecialContent(extract.binding, textMode));
	}

	support(extract: DoubanSubject): boolean {
		return extract && extract.type && (extract.type.contains("书籍") || extract.type.contains("Book") || extract.type.contains("book"));
	}

	handleSpecialAuthorName(authorName: string): string {
		return authorName.replace(/\[/g, '')
			.replace(']', '/');
	}

	parseSubjectFromHtml(html: CheerioAPI): DoubanBookSubject {
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
			} else if (key.indexOf('作者') >= 0 || key.indexOf('丛书') >= 0 || key.indexOf('出版社') >= 0) {
				value = html(info.next.next).text().trim();
			} else {
				value = html(info.next).text().trim();
			}
			valueMap.set(BookKeyValueMap.get(key), value);
		})

		let idPattern = /(\d){5,10}/g;
		let idE = idPattern.exec(url);
		let id = idE ? idE[0] : '';
		let menuIdDom = html('#dir_' + id + '_full') ? html('#dir_' + id + '_full') : html('#dir_' + id + '_short');
		let menu: string[] = menuIdDom ? html(menuIdDom.get(0)).text().trim().split('\n').map(row => row.trim()) : [];
		menu.length > 0 ? menu.pop() : menu;
		const result: DoubanBookSubject = {
			author: author,
			translator: valueMap.has('translator') ? valueMap.get('translator') : [],
			image: image,
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
	]
);
