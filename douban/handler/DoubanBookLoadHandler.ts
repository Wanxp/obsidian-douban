import { Editor, moment, renderResults } from "obsidian";

import  { CheerioAPI } from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanBookSubject from "douban/model/DoubanBookSubject";
import DoubanPlugin from "main";
import { DoubanPluginSettings } from "douban/Douban";
import DoubanSubject from "douban/model/DoubanSubject";

export default class DoubanBookLoadHandler extends DoubanAbstractLoadHandler<DoubanBookSubject> {

    parseText(extract: DoubanBookSubject, settings:DoubanPluginSettings): string {
		return settings.bookTemplate ? settings.bookTemplate.replaceAll("{{id}}", extract.id)
		.replaceAll("{{type}}", extract.type ? extract.type : "")
		.replaceAll("{{title}}", extract.title ? extract.title : "")
		.replaceAll("{{desc}}", extract.desc ? extract.desc : "")
		.replaceAll("{{image}}", extract.image  ? extract.image : "")
		.replaceAll("{{author}}", extract.author  ? extract.author.join(settings.arraySpilt) : "")
		.replaceAll("{{datePublished}}", extract.datePublished  ?  moment(extract.datePublished).format(settings.dateFormat) : "")
		.replaceAll("{{url}}", extract.url  ? extract.url : "")
		.replaceAll("{{score}}", extract.score && extract.score ? extract.score + "" : "")
		.replaceAll("{{translator}}", extract.translator  ? extract.translator.join(settings.arraySpilt) : "")
		.replaceAll("{{totalWord}}", extract.totalWord  ? extract.totalWord+"" : "")
		.replaceAll("{{isbn}}", extract.isbn  ? extract.isbn : "")
		.replaceAll("{{publish}}", extract.publish  ? extract.publish : "")
		.replaceAll("{{originalTitle}}", extract.originalTitle  ? extract.originalTitle : "")
		.replaceAll("{{subTitle}}", extract.subTitle  ? extract.subTitle : "")
		.replaceAll("{{totalPage}}", extract.totalPage  ? extract.totalPage + "" : "")
		.replaceAll("{{menu}}", extract.menu  ? extract.menu.join(settings.arraySpilt) : "")
		.replaceAll("{{price}}", extract.price  ? extract.price + "" : "")
		.replaceAll("{{labels}}", extract.labels  ? extract.labels.join(settings.arraySpilt) : "")

		: undefined;    
    }
    support(extract: DoubanSubject): boolean {
        return extract && extract.type && (extract.type.contains("书籍") || extract.type.contains("Book") || extract.type.contains("book"));
    }



    

    constructor(doubanPlugin:DoubanPlugin) {
        super(doubanPlugin);
    }

    parseSubjectFromHtml(html: CheerioAPI): DoubanBookSubject {
        var title = html(html("head > meta[property= 'og:title']").get(0)).attr("content");
        var desc = html(html("head > meta[property= 'og:description']").get(0)).attr("content");
        var url = html(html("head > meta[property= 'og:url']").get(0)).attr("content");
        var image = html(html("head > meta[property= 'og:image']").get(0)).attr("content");
        var type = html(html("head > meta[property= 'og:type']").get(0)).attr("content");
        var author = html(html("head > meta[property= 'book:author']").get(0)).attr("content");
        var isbn = html(html("head > meta[property= 'book:isbn']").get(0)).attr("content");
        var detailDom = html(html("#info").get(0))
        var publish = detailDom.find("span:contains('出版社') > a").text();
        var translator = detailDom.find("span:contains('译者') > a").text();

        var idPattern = /(\d){5,10}/g;
        var id = idPattern.exec(url);

        var info = detailDom.html.toString();

        var datePublishedPattern = /<span class="pl">出版年:<\/span> ((\d){4}-(\d){1,2})<br\/>/g;
        var datePublished = datePublishedPattern.exec(info);

        const result:DoubanBookSubject = {
            author: [author],
            translator: [translator],
            bookType: "",
            image: image,
            datePublished: datePublished?new Date(datePublished[0]):null,
            totalWord: 0,
            isbn: isbn,
            publish: publish,
            score: 0,
            originalTitle: "",
            subTitle: "",
            totalPage: 0,
            belong: "",
            menu: [],
            price: 0,
            labels: [],
            id: id ? id[0]:"",
            type: "Book",
            title: title,
            desc: desc,
            url: url
        };
        return result;
}


}


