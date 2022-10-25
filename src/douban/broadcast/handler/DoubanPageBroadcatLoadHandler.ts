import  { CheerioAPI } from 'cheerio';
import DoubanAbstractLoadHandler from 'src/douban/data/handler/DoubanAbstractLoadHandler';
import DoubanNoteSubject from '../model/DoubanPageBroadcastSubject';
import DoubanPageBroadcastSubject from '../model/DoubanPageBroadcastSubject';
import DoubanPlugin from "main";
import { DoubanPluginSettings } from "src/douban/Douban";
import DoubanSubject from 'src/douban/data/model/DoubanSubject';
import html2markdown from '@notable/html2markdown';
import { moment } from "obsidian";

export default class DoubanPageBroadcatLoadHandler extends DoubanAbstractLoadHandler<DoubanPageBroadcastSubject> {

    parseText(extract: DoubanNoteSubject, settings:DoubanPluginSettings): string {
		return settings.bookTemplate ? null
        // settings.noteTemplate
        // .replaceAll("{{id}}", extract.id)
		// .replaceAll("{{type}}", extract.type ? extract.type : "")
		// .replaceAll("{{title}}", extract.title ? extract.title : "")
		// .replaceAll("{{desc}}", extract.desc ? extract.desc : "")
		// .replaceAll("{{image}}", extract.image  ? extract.image : "")
		// .replaceAll("{{timePublished}}", extract.timePublished  ?  moment(extract.timePublished).format(settings.dateTimeFormat) : "")
		// .replaceAll("{{url}}", extract.url  ? extract.url : "")
		// .replaceAll("{{content}}", extract.content  ? extract.content : "")
		// .replaceAll("{{url}}", extract.url  ? extract.url : "")
		// .replaceAll("{{authorUrl}}", extract.authorUrl  ? extract.authorUrl : "")
        // .replaceAll("{{author}}", extract.author  ? extract.author : "")


		: undefined;    
    }
    support(extract: DoubanSubject): boolean {
        return extract && extract.type && (extract.type.contains("广播") || extract.type.contains("Broadcast"));
    }



    

    constructor(doubanPlugin:DoubanPlugin) {
        super(doubanPlugin);
    }

    parseSubjectFromHtml(html: CheerioAPI): DoubanPageBroadcastSubject {
        // return html('.new-status .status-wrapper')
        //     .get()
        //     .map(i -> {
        //         let div = html(i);
        //         div.find('')
        //     });

        let title = html(html("head > meta[property= 'og:title']").get(0)).attr("content");
        let desc = html(html("head > meta[property= 'og:description']").get(0)).attr("content");
        let url = html(html("head > meta[property= 'og:url']").get(0)).attr("content");
        let image = html(html("head > meta[property= 'og:image']").get(0)).attr("content");
        let type = html(html("head > meta[property= 'og:type']").get(0)).attr("content");
        let authorA = html(html("a.note-author").get(0));
        let timePublished = html(html(".pub-date").get(0)).text();
        let content = html(html(".note").get(1));
        let idPattern = /(\d){5,10}/g;
        let id = idPattern.exec(url);

        // const result:DoubanNoteSubject = {
        //     image: image,
        //     timePublished: timePublished ? new Date(timePublished) : null,
        //     content: content ? html2markdown(content.toString()): "",
        //     id: id ? id[0] : "",
        //     type: "Article",
        //     title: title,
        //     desc: desc,
        //     url: url,
        //     author: authorA ? authorA.text() : null,
        //     authorUrl: authorA ? authorA.attr("href") : null,
        // };
        // return result;
        return null;
}


}
