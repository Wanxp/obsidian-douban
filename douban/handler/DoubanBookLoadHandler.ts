import { Editor, moment, renderResults } from "obsidian";
import cheerio, { CheerioAPI } from 'cheerio';
import { get, readStream } from "tiny-network";

import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanBookSubject from "douban/model/DoubanBookSubject";
import DoubanPlugin from "main";
import { DoubanPluginSettings } from "douban/Douban";
import DoubanSubject from "douban/model/DoubanSubject";
import SchemaOrg from "utils/SchemaOrg";
import { log } from "utils/Logutil";

export default class DoubanBookLoadHandler extends DoubanAbstractLoadHandler<DoubanBookSubject> {

    parseText(extract: DoubanBookSubject, settings:DoubanPluginSettings): string {
		return settings.movieTemplate ? settings.movieTemplate.replaceAll("{{id}}", extract.id)
		.replaceAll("{{type}}", extract.type ? extract.type : "")
		.replaceAll("{{title}}", extract.title ? extract.title : "")
		.replaceAll("{{desc}}", extract.desc ? extract.desc : "")
		.replaceAll("{{image}}", extract.image  ? extract.image : "")
		// .replaceAll("{{director}}", extract.director  ? extract.director.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, settings)).filter(c => c).join(settings.arraySpilt) : "")
		// .replaceAll("{{actor}}", extract.actor  ? extract.actor.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, settings)).filter(c => c).join(settings.arraySpilt) : "")
		.replaceAll("{{author}}", extract.author  ? extract.author.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, settings)).filter(c => c).join(settings.arraySpilt) : "")
		.replaceAll("{{datePublished}}", extract.datePublished  ?  moment(extract.datePublished).format(settings.dateFormat) : "")
		.replaceAll("{{url}}", extract.url  ? extract.url : "")
		.replaceAll("{{score}}", extract.aggregateRating && extract.aggregateRating.ratingValue ? extract.aggregateRating.ratingValue + "" : "")
		: undefined;    }
    support(extract: DoubanSubject): boolean {
        return extract && extract.type && (extract.type.contains("书籍") || extract.type.contains("Book") || extract.type.contains("book"));
    }



    

    constructor(doubanPlugin:DoubanPlugin) {
        super(doubanPlugin);
    }

    parseSubjectFromHtml(data: CheerioAPI): DoubanBookSubject {
       return data('script')
            .get()
            .filter(scd => "application/ld+json" == data(scd).attr("type"))
            .map(i => {
                var item = data(i).text();
                item = super.html_decode(item);
                var obj = JSON.parse(item.replace(/[\r\n\s+]/g, ''));
                var idPattern = /(\d){5,10}/g;
                var id = idPattern.exec(obj.url);
                const result:DoubanBookSubject = {
                    id: id?id[0]:'',
                    type: 'Book',
                    title: obj.name,
                    desc: obj.description,
                    url: "https://book.douban.com" + obj.url,
                    author: obj.author,
                    aggregateRating: obj.aggregateRating,
                    datePublished: obj.datePublished ? new Date(obj.datePublished) : undefined,
                    image:obj.image
                }
        return result;
    })[0];
}


}


