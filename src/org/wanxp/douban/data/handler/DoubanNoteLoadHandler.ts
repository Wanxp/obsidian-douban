import {CheerioAPI} from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanNoteSubject from '../model/DoubanNoteSubject';
import DoubanPlugin from "../../../main";
import DoubanSubject from '../model/DoubanSubject';
import html2markdown from '@notable/html2markdown';
import HandleContext from "../model/HandleContext";
import {SupportType, TemplateKey} from "../../../constant/Constsant";
import {UserStateSubject} from "../model/UserStateSubject";
import {DataField} from "../../../utils/model/DataField";

export default class DoubanNoteLoadHandler extends DoubanAbstractLoadHandler<DoubanNoteSubject> {

	constructor(doubanPlugin: DoubanPlugin) {
		super(doubanPlugin);
	}

	getSupportType(): SupportType {
		return SupportType.NOTE;
	}

	getHighQuantityImageUrl(fileName:string):string{
		return ``;
	}

	getSubjectUrl(id:string):string{
		return `https://www.douban.com/note/${id}/`;
	}

	parseVariable(beforeContent: string, variableMap:Map<string, DataField>, extract: DoubanNoteSubject, context: HandleContext): void {
	}

	support(extract: DoubanSubject): boolean {
		return extract && extract.type && (extract.type.contains("日记") || extract.type.contains("Note") || extract.type.contains("Article") || extract.type.contains("note") || extract.type.contains("article"));
	}

	analysisUser(html: CheerioAPI, context: HandleContext): {data:CheerioAPI ,  userState: UserStateSubject} {
		return {data: html, userState: null};
	}

	parseSubjectFromHtml(html: CheerioAPI, context: HandleContext): DoubanNoteSubject {
		const title = html(html("head > meta[property= 'og:title']").get(0)).attr("content");
		const desc = html(html("head > meta[property= 'og:description']").get(0)).attr("content");
		const url = html(html("head > meta[property= 'og:url']").get(0)).attr("content");
		const image = html(html("head > meta[property= 'og:image']").get(0)).attr("content");
		const type = html(html("head > meta[property= 'og:type']").get(0)).attr("content");
		const authorA = html(html("a.note-author").get(0));
		const timePublished = html(html(".pub-date").get(0)).text();
		const content = html(html(".note").get(1));
		const idPattern = /(\d){5,10}/g;
		const id = idPattern.exec(url);

		const result: DoubanNoteSubject = {
			image: image,
			imageUrl: image,
			datePublished: timePublished ? new Date(timePublished) : undefined,
			content: content ? html2markdown(content.toString()) : "",
			id: id ? id[0] : "",
			type: this.getSupportType(),
			title: title,
			desc: desc,
			url: url,
			author: authorA ? authorA.text() : null,
			authorUrl: authorA ? authorA.attr("href") : null,
			score: 0,
			publisher: '',
			genre: []
		};
		return result;
	}


}
