import {CheerioAPI} from "cheerio";
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanPlugin from "main";
import DoubanSubject from "../model/DoubanSubject";
import DoubanTeleplaySubject from "../model/DoubanTeleplaySubject";
import SchemaOrg from "src/utils/SchemaOrg";
import HandleContext from "@App/data/model/HandleContext";
import {TemplateKey} from "../../../constant/Constsant";

/**
 * teleplay
 */
export class DoubanTeleplayLoadHandler extends DoubanAbstractLoadHandler<DoubanTeleplaySubject> {

	constructor(doubanPlugin: DoubanPlugin) {
		super(doubanPlugin);
	}

	getTemplateKey(context: HandleContext): TemplateKey {
		return TemplateKey.teleplayTemplate
	}

	parseText(beforeContent: string, extract: DoubanTeleplaySubject, context: HandleContext): string {
		const {settings} = context;
		return beforeContent
			.replaceAll("{{originalTitle}}", extract.originalTitle ? extract.originalTitle : "")
			.replaceAll("{{director}}", extract.director ? extract.director.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, context)).filter(c => c).join(settings.arraySpilt) : "")
			.replaceAll("{{actor}}", extract.actor ? extract.actor.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, context)).filter(c => c).join(settings.arraySpilt) : "")
			.replaceAll("{{author}}", extract.author ? extract.author.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, context)).filter(c => c).join(settings.arraySpilt) : "")
	}

	support(extract: DoubanSubject): boolean {
		return extract && extract.type && (extract.type.contains("电视剧") || extract.type.contains("Teleplay") || extract.type.contains("teleplay"));
	}


	parseSubjectFromHtml(data: CheerioAPI): DoubanTeleplaySubject {
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
				let title = titleExec ? titleExec[0] : name;

				let originalTitleExec = /[a-zA-Z.\s\-]{2,50}/g.exec(name);
				let originalTitle = originalTitleExec ? originalTitleExec[0] : name;

				const result: DoubanTeleplaySubject = {
					id: id ? id[0] : '',
					type: 'Teleplay',
					title: title,
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
					score: obj.aggregateRating ? obj.aggregateRating.ratingValue : undefined,
					publisher: ""
				}
				return result;
			})[0];
	}

}
