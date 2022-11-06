import {CheerioAPI} from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanPlugin from "main";
import SchemaOrg from "src/utils/SchemaOrg";
import DoubanSubject from '../model/DoubanSubject';
import DoubanMovieSubject from '../model/DoubanMovieSubject';
import StringUtil from "../../../utils/StringUtil";
import HandleContext from "@App/data/model/HandleContext";
import {PersonNameMode, SupportType, TemplateKey} from "../../../constant/Constsant";

export default class DoubanMovieLoadHandler extends DoubanAbstractLoadHandler<DoubanMovieSubject> {

	constructor(doubanPlugin: DoubanPlugin) {
		super(doubanPlugin);
	}

	getSupportType(): SupportType {
		return SupportType.MOVIE;
	}

	parseText(beforeContent: string, extract: DoubanMovieSubject, context: HandleContext): string {
		const {settings} = context;
		return beforeContent
			.replaceAll("{{originalTitle}}", extract.originalTitle ? extract.originalTitle : "")
			.replaceAll("{{director}}", extract.director ? extract.director.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, context)).filter(c => c).join(settings.arraySpilt) : "")
			.replaceAll("{{actor}}", extract.actor ? extract.actor.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, context)).filter(c => c).join(settings.arraySpilt) : "")
			.replaceAll("{{author}}", extract.author ? extract.author.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, context)).filter(c => c).join(settings.arraySpilt) : "")
			;
	}

	support(extract: DoubanSubject): boolean {
		return extract && extract.type && (extract.type.contains("电影") || extract.type.contains("Movie") || extract.type.contains("movie"));
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
				let title = super.getPersonNameByMode(name, PersonNameMode.CH_NAME)??name;
				let originalTitle =  super.getPersonNameByMode(name, PersonNameMode.EN_NAME) ?? name;

				const result: DoubanMovieSubject = {
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


