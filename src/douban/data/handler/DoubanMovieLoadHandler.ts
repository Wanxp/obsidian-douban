import  { CheerioAPI } from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanPlugin from "main";
import { DoubanPluginSettings } from "src/douban/Douban";
import SchemaOrg from "src/utils/SchemaOrg";
import DoubanSubject from '../model/DoubanSubject';
import DoubanMovieSubject from '../model/DoubanMovieSubject';

export default class DoubanMovieLoadHandler extends DoubanAbstractLoadHandler<DoubanMovieSubject> {

	getTemplate(settings: DoubanPluginSettings): string {
		return settings.movieTemplate;
	}

    parseText(beforeContent:string, extract: DoubanMovieSubject, settings:DoubanPluginSettings): string {
		return beforeContent
        .replaceAll("{{originalTitle}}", extract.originalTitle ? extract.originalTitle : "")
		.replaceAll("{{director}}", extract.director  ? extract.director.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, settings)).filter(c => c).join(settings.arraySpilt) : "")
		.replaceAll("{{actor}}", extract.actor  ? extract.actor.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, settings)).filter(c => c).join(settings.arraySpilt) : "")
		.replaceAll("{{author}}", extract.author  ? extract.author.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, settings)).filter(c => c).join(settings.arraySpilt) : "")
			;
	}
    support(extract: DoubanSubject): boolean {
        return extract && extract.type && (extract.type.contains("电影") || extract.type.contains("Movie") || extract.type.contains("movie"));
    }



    

    constructor(doubanPlugin:DoubanPlugin) {
        super(doubanPlugin);
    }

    parseSubjectFromHtml(data: CheerioAPI): DoubanMovieSubject {
        return data('script')
                .get()
                .filter(scd => "application/ld+json" == data(scd).attr("type"))
                .map(i => {
                    let item = data(i).text();
                    item = super.html_decode(item);
                    let obj = JSON.parse(item.replace(/[\r\n\s+]/g, ''));
                    let idPattern = /(\d){5,10}/g;
                    let id = idPattern.exec(obj.url);
                    let name = obj.name;
                    let titleExec = /[\u4e00-\u9fa5]{2,20}/g.exec(name);
                    let title = titleExec?titleExec[0]:name;

                    let originalTitleExec = /[a-zA-Z.\s\-]{2,50}/g.exec(name);
                    let originalTitle = originalTitleExec?originalTitleExec[0]:name;

                    const result:DoubanMovieSubject = {
						id: id ? id[0] : '',
						title: title,
						type: 'Movie',
						score: obj.aggregateRating ? obj.aggregateRating.ratingValue : undefined,
						originalTitle: originalTitle,
						desc: obj.description,
						url: "https://movie.douban.com" + obj.url,
						director: obj.director,
						author: obj.author,
						actor: obj.actor,
						aggregateRating: obj.aggregateRating,
						datePublished: obj.datePublished ? new Date(obj.datePublished) : undefined,
						image: obj.image,
						genre: obj.genre,
						publisher: ''
					}
            return result;
        })[0];
    }

}


