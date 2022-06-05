import { Editor, renderResults } from "obsidian";
import cheerio, { CheerioAPI } from 'cheerio';
import { get, readStream } from "tiny-network";

import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanMovieSubject from "douban/model/DoubanMovieSubject";
import DoubanPlugin from "main";
import { DoubanPluginSettings } from "douban/Douban";
import DoubanSubject from "douban/model/DoubanSubject";
import { log } from "utils/logutil";

export default class DoubanMovieLoadHandler extends DoubanAbstractLoadHandler<DoubanMovieSubject> {

    parseText(template: string, arraySpilt:string, extract: DoubanMovieSubject): string {
		return template ? template.replace("{{id}}", extract.id)
		.replace("{{type}}", extract.type ? extract.type : "")
		.replace("{{title}}", extract.title ? extract.title : "")
		.replace("{{desc}}", extract.desc ? extract.desc : "")
		.replace("{{image}}", extract.image  ? extract.image : "")
		.replace("{{director}}", extract.director  ? extract.director.join(arraySpilt) : "")
		.replace("{{actor}}", extract.actor  ? extract.actor.join(arraySpilt) : "")
		.replace("{{author}}", extract.author  ? extract.author.join(arraySpilt) : "")
		.replace("{{datePublished}}", extract.datePublished  ? extract.datePublished : "")
		.replace("{{url}}", extract.url  ? extract.url : "")
		.replace("{{score}}", extract.aggregateRating && extract.aggregateRating.ratingValue ? extract.aggregateRating.ratingValue + "" : "")
		: undefined;    }
    support(extract: DoubanSubject): boolean {
        return extract && ('[电影]'==extract.type || 'Movie' == extract.type);
    }

    

    constructor(doubanPlugin:DoubanPlugin) {
        super(doubanPlugin);
    }

    parseSubjectFromHtml(data: CheerioAPI): DoubanMovieSubject {
       return data('script')
            .get()
            .filter(scd => "application/ld+json" == data(scd).attr("type"))
            .map(i => {
                var item = data(i).text();
                var obj = JSON.parse(item);
                var idPattern = /(\d){5,10}/g;
                var id = idPattern.exec(obj.url);
                log.info(item);
                const result:DoubanMovieSubject = {
                    id: id?id[0]:'',
                    type: 'Movie',
                    title: obj.name,
                    desc: obj.description,
                    url: "https://movie.douban.com" + obj.url,
                    director: obj.director,
                    author: obj.author,
                    actor: obj.actor,
                    aggregateRating: obj.aggregateRating,
                    datePublished:obj.datePublished,
                    image:obj.image
                }
                log.info(result);
        return result;
    })[0];
}


}


