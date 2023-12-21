import {CheerioAPI} from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanPlugin from "../../../main";
import SchemaOrg from "src/org/wanxp/utils/SchemaOrg";
import DoubanSubject from '../model/DoubanSubject';
import DoubanMovieSubject from '../model/DoubanMovieSubject';
import StringUtil from "../../../utils/StringUtil";
import HandleContext from "../model/HandleContext";
import {PersonNameMode, PropertyName, SupportType, TemplateKey} from "../../../constant/Constsant";
import {UserStateSubject} from "../model/UserStateSubject";
import {moment} from "obsidian";
import YamlUtil, {SPECIAL_CHAR_REG, TITLE_ALIASES_SPECIAL_CHAR_REG_G} from "../../../utils/YamlUtil";

export default class DoubanMovieLoadHandler extends DoubanAbstractLoadHandler<DoubanMovieSubject> {

	constructor(doubanPlugin: DoubanPlugin) {
		super(doubanPlugin);
	}

	getSupportType(): SupportType {
		return SupportType.MOVIE;
	}

	getHighQuantityImageUrl(fileName:string):string{
		return `https://img9.doubanio.com/view/photo/l/public/${fileName}`;
	}

	getSubjectUrl(id:string):string{
		return `https://movie.douban.com/subject/${id}/`;
	}

	parseText(beforeContent: string, extract: DoubanMovieSubject, context: HandleContext): string {
		const {settings} = context;
		return beforeContent
			.replaceAll("{{originalTitle}}", extract.originalTitle ??  "")
			.replaceAll("{{director}}", this.handleArray(extract.director.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, context)).filter(c => c), context))
			.replaceAll("{{actor}}", this.handleArray( extract.actor.map(SchemaOrg.getPersonName).filter(c => c), context))
			.replaceAll("{{author}}", this.handleArray(extract.author.map(SchemaOrg.getPersonName).filter(c => c), context))
			.replaceAll("{{aliases}}", this.handleArray(extract.aliases.map(a=>a.replace(TITLE_ALIASES_SPECIAL_CHAR_REG_G, '_')), context))
			.replaceAll("{{country}}", this.handleArray( extract.country, context))
			.replaceAll("{{language}}",this.handleArray( extract.language, context))
			.replaceAll("{{IMDb}}", extract.IMDb ??"")
			.replaceAll("{{time}}", extract.time ??"")
			;
	}

	support(extract: DoubanSubject): boolean {
		return extract && extract.type && (extract.type.contains("电影") || extract.type.contains("Movie") || extract.type.contains("movie"));
	}

	analysisUser(html: CheerioAPI, context: HandleContext): {data:CheerioAPI ,  userState: UserStateSubject} {
		let rate = html('input#n_rating').val();
		let tagsStr = html('div#interest_sect_level > div.a_stars > span.color_gray').text().trim();
		let tags = tagsStr ? tagsStr.replace('标签:', '').trim().split(' ') : null;
		let stateWord = html('div#interest_sect_level > div.a_stars > span.mr10').text().trim();
		let collectionDateStr = html('div#interest_sect_level > div.a_stars > span.mr10 > span.collection_date').text().trim();
		let userState1 = DoubanAbstractLoadHandler.getUserState(stateWord);
		let component = this.getComment(html, context);


		const userState: UserStateSubject = {
			tags: tags,
			rate: rate?Number(rate):null,
			state: userState1,
			collectionDate: collectionDateStr?moment(collectionDateStr, 'YYYY-MM-DD').toDate():null,
			comment: component
		}
		return {data: html, userState: userState};
	}


	private getComment(html: CheerioAPI, context: HandleContext) {
		const component = html('div#interest_sect_level > div.a_stars > span.color_gray').next().next().text().trim();
		if (component) {
			return component;
		}
		return this.getPropertyValue(html, PropertyName.comment);
	}

	parseSubjectFromHtml(html: CheerioAPI, context: HandleContext): DoubanMovieSubject {
		 const movie:DoubanMovieSubject = html('script')
			.get()
			.filter(scd => "application/ld+json" == html(scd).attr("type"))
			.map(i => {
				let item = html(i).text();
				item = super.html_decode(item);
				const obj = JSON.parse(item.replace(/[\r\n+]/g, ''));
				const idPattern = /(\d){5,10}/g;
				const id = idPattern.exec(obj.url);
				const name = obj.name;
				const title = super.getTitleNameByMode(name, PersonNameMode.CH_NAME, context)??name;
				const originalTitle =  super.getTitleNameByMode(name, PersonNameMode.EN_NAME, context) ?? name;

				const result: DoubanMovieSubject = {
					id: id ? id[0] : '',
					title: title,
					type: this.getSupportType(),
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
					imageUrl: obj.image,
					genre: obj.genre,
					publisher: '',
					aliases: [""],
					language: [""],
					country: [],
					time: null,
					IMDb: null,
				}
				return result;
			})[0];
		this.handlePersonNameByMeta(html, movie,  context, 'video:actor', 'actor');
		this.handlePersonNameByMeta(html, movie,  context, 'video:director', 'director');

		const desc:string = html("span[property='v:summary']").text();
		if (desc) {
			movie.desc = desc;
		}

		const detailDom = html(html("#info").get(0));
		const publish = detailDom.find("span.pl");

		const valueMap = new Map<string, any>();

		publish.map((index, info) => {
			const key = html(info).text().trim();
			let value;
			if (key.indexOf('又名') >= 0 || key.indexOf('语言') >= 0 || key.indexOf('制片国家') >= 0) {
				// value = html(info.next.next).text().trim();
				const vas = html(info.next).text().trim();
				value = vas.split("/").map((v) => v.trim());
			} else if(key.indexOf('片长') >= 0) {
				value = html(info.next.next).text().trim()
			} else {
				value = html(info.next).text().trim();
			}
			valueMap.set(MovieKeyValueMap.get(key), value);
		})

		movie.country =  valueMap.has('country') ? valueMap.get('country') : [];
		movie.language =  valueMap.has('language') ? valueMap.get('language') : [];
		movie.time =  valueMap.has('time') ? valueMap.get('time') : "";
		movie.aliases =  valueMap.has('aliases') ? valueMap.get('aliases') : [];
		movie.IMDb =  valueMap.has('IMDb') ? valueMap.get('IMDb') : "";
		return movie;
	}


}

const MovieKeyValueMap: Map<string, string> = new Map(
	[['制片国家/地区:', 'country'],
		['语言:', 'language'],
		['片长:', 'time'],
		['又名:', 'aliases'],
		['IMDb:', 'IMDb']
	]
);
