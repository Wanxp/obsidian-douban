import { CheerioAPI } from "cheerio";
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanPlugin from "main";
import { DoubanPluginSettings } from "douban/Douban";
import DoubanSubject from "douban/model/DoubanSubject";
import DoubanTeleplaySubject from "douban/model/DoubanTeleplaySubject";
import SchemaOrg from "utils/SchemaOrg";
import { moment } from "obsidian";

/**
 * teleplay
 */
export class DoubanTeleplayLoadHandler extends DoubanAbstractLoadHandler<DoubanTeleplaySubject>{

        

    constructor(doubanPlugin:DoubanPlugin) {
        super(doubanPlugin);
    }

    
    parseText(extract: DoubanTeleplaySubject, settings:DoubanPluginSettings): string {
		return settings.movieTemplate ? settings.movieTemplate.replaceAll("{{id}}", extract.id)
		.replaceAll("{{type}}", extract.type ? extract.type : "")
		.replaceAll("{{title}}", extract.title ? extract.title : "")
        .replaceAll("{{originalTitle}}", extract.originalTitle ? extract.originalTitle : "")
		.replaceAll("{{desc}}", extract.desc ? extract.desc : "")
		.replaceAll("{{image}}", extract.image  ? extract.image : "")
		.replaceAll("{{director}}", extract.director  ? extract.director.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, settings)).filter(c => c).join(settings.arraySpilt) : "")
		.replaceAll("{{actor}}", extract.actor  ? extract.actor.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, settings)).filter(c => c).join(settings.arraySpilt) : "")
		.replaceAll("{{author}}", extract.author  ? extract.author.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, settings)).filter(c => c).join(settings.arraySpilt) : "")
		.replaceAll("{{datePublished}}", extract.datePublished  ?  moment(extract.datePublished).format(settings.dateFormat) : "")
		.replaceAll("{{url}}", extract.url  ? extract.url : "")
		.replaceAll("{{score}}", extract.aggregateRating && extract.aggregateRating.ratingValue ? extract.aggregateRating.ratingValue + "" : "")
        .replaceAll("{{genre}}", extract.genre ? extract.genre.join(settings.arraySpilt) : "")

		: undefined;    }

    support(extract: DoubanSubject): boolean {
        return extract && extract.type && (extract.type.contains("电视剧") || extract.type.contains("Teleplay") || extract.type.contains("teleplay"));
    }


    parseSubjectFromHtml(data: CheerioAPI): DoubanTeleplaySubject {
        return data('script')
                .get()
                .filter(scd => "application/ld+json" == data(scd).attr("type"))
                .map(i => {
                    var item = data(i).text();
                    item = super.html_decode(item);
                    var obj = JSON.parse(item.replace(/[\r\n\s+]/g, ''));
                    var idPattern = /(\d){5,10}/g;
                    var id = idPattern.exec(obj.url);
                    var name = obj.name;
                    var titleExec = /[\u4e00-\u9fa5]{2,20}/g.exec(name);
                    var title = titleExec?titleExec[0]:name;

                    var originalTitleExec = /[a-zA-Z.\s\-]{2,50}/g.exec(name);
                    var originalTitle = originalTitleExec?originalTitleExec[0]:name;

                    const result:DoubanTeleplaySubject = {
                        id: id?id[0]:'',
                        type: 'Movie',
                        title: title,
                        originalTitle: originalTitle,
                        desc: obj.description,
                        url: "https://movie.douban.com" + obj.url,
                        director: obj.director,
                        author: obj.author,
                        actor: obj.actor,
                        aggregateRating: obj.aggregateRating,
                        datePublished: obj.datePublished ? new Date(obj.datePublished) : undefined,
                        image:obj.image,
                        genre:obj.genre
                    }
            return result;
        })[0];
    }

}