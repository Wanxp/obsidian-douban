import {CheerioAPI} from "cheerio";
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanPlugin from "../../../main";
import DoubanSubject from "../model/DoubanSubject";
import DoubanTeleplaySubject from "../model/DoubanTeleplaySubject";
import SchemaOrg from "src/org/wanxp/utils/SchemaOrg";
import HandleContext from "../model/HandleContext";
import {PersonNameMode, SupportType, TemplateKey} from "../../../constant/Constsant";
import {aliases} from "css-select";
import {UserStateSubject} from "../model/UserStateSubject";
import {moment} from "obsidian";
import YamlUtil, {SPECIAL_CHAR_REG, TITLE_ALIASES_SPECIAL_CHAR_REG_G} from "../../../utils/YamlUtil";

/**
 * teleplay
 */
export class DoubanTeleplayLoadHandler extends DoubanAbstractLoadHandler<DoubanTeleplaySubject> {

	constructor(doubanPlugin: DoubanPlugin) {
		super(doubanPlugin);
	}

	getSupportType(): SupportType {
		return SupportType.TELEPLAY;
	}

	parseText(beforeContent: string, extract: DoubanTeleplaySubject, context: HandleContext): string {
		const {settings} = context;
		return beforeContent
			.replaceAll("{{originalTitle}}", extract.originalTitle ? extract.originalTitle : "")
			.replaceAll("{{director}}", extract.director ? extract.director.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, context)).filter(c => c).join(settings.arraySpilt) : "")
			.replaceAll("{{actor}}", extract.actor ? extract.actor.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, context)).filter(c => c).join(settings.arraySpilt) : "")
			.replaceAll("{{author}}", extract.author ? extract.author.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, context)).filter(c => c).join(settings.arraySpilt) : "")
			.replaceAll("{{aliases}}", extract.aliases ? extract.aliases.map(a=>a.replace(TITLE_ALIASES_SPECIAL_CHAR_REG_G, '_')).join(settings.arraySpilt) : "")
			.replaceAll("{{country}}", extract.country ? extract.country.join(settings.arraySpilt) : "")
			.replaceAll("{{language}}", extract.language ? extract.language.join(settings.arraySpilt) : "")
			.replaceAll("{{IMDb}}", extract.IMDb ? extract.IMDb : "")
			.replaceAll("{{time}}", extract.time ? extract.time : "")
			.replaceAll("{{episode}}", extract.episode ? extract.episode : "")
;
	}

	support(extract: DoubanSubject): boolean {
		return extract && extract.type && (extract.type.contains("电视剧") || extract.type.contains("Teleplay") || extract.type.contains("teleplay"));
	}
	analysisUser(html: CheerioAPI, context: HandleContext): {data:CheerioAPI ,  userState: UserStateSubject} {
		let rate = html('input#n_rating').val();
		const rating = html('span#rating');
		let tagsStr = rating.next().next().text().trim();
		let tags = tagsStr ? tagsStr.replace('标签:', '').trim().split(' ') : null;
		let stateWord = html('div#interest_sect_level > div.a_stars > span.mr10').text().trim();
		let collectionDateStr = html('div#interest_sect_level > div.a_stars > span.mr10 > span.collection_date').text().trim();
		let userState1 = DoubanAbstractLoadHandler.getUserState(stateWord);
		let component = rating.next().next().next().next().text().trim();

		const userState: UserStateSubject = {
			tags: tags,
			rate: rate?Number(rate):null,
			state: userState1,
			collectionDate: collectionDateStr?moment(collectionDateStr, 'YYYY-MM-DD').toDate():null,
			comment: component
		}
		return {data: html, userState: userState};
	}

	parseSubjectFromHtml(html: CheerioAPI, context: HandleContext): DoubanTeleplaySubject {
		const teleplay:DoubanTeleplaySubject = html('script')
			.get()
			.filter(scd => "application/ld+json" == html(scd).attr("type"))
			.map(i => {
				let item = html(i).text();
				item = super.html_decode(item);
				let obj = JSON.parse(item.replace(/[\r\n\s+]/g, ''));
				let idPattern = /(\d){5,10}/g;
				let id = idPattern.exec(obj.url);
				let name = obj.name;
				let title = super.getTitleNameByMode(name, PersonNameMode.CH_NAME, context)??name;
				let originalTitle =  super.getTitleNameByMode(name, PersonNameMode.EN_NAME, context) ?? name;

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
					publisher: "",
					aliases: [""],
					language: [""],
					country: [],
					episode: null,
					time: null,
					IMDb: null,
				}
				return result;
			})[0];

		this.handlePersonNameByMeta(html, teleplay,  context, 'video:actor', 'actor');
		this.handlePersonNameByMeta(html, teleplay,  context, 'video:director', 'director');


		let detailDom = html(html("#info").get(0));
		let publish = detailDom.find("span.pl");

		let valueMap = new Map<string, any>();

		publish.map((index, info) => {
			let key = html(info).text().trim();
			let value;
			if (key.indexOf('又名') >= 0 || key.indexOf('语言') >= 0 || key.indexOf('制片国家') >= 0) {
				// value = html(info.next.next).text().trim();
				let vas = html(info.next).text().trim();
				value = vas.split("/").map((v) => v.trim());
			}else {
				value = html(info.next).text().trim();
			}
			valueMap.set(TeleplayKeyValueMap.get(key), value);
		})
		teleplay.country =  valueMap.has('country') ? valueMap.get('country') : [];
		teleplay.language =  valueMap.has('language') ? valueMap.get('language') : [];
		teleplay.episode =  valueMap.has('episode') ? valueMap.get('episode') : "";
		teleplay.time =  valueMap.has('time') ? valueMap.get('time') : "";
		teleplay.aliases =  valueMap.has('aliases') ? valueMap.get('aliases') : [];
		teleplay.IMDb =  valueMap.has('IMDb') ? valueMap.get('IMDb') : "";
		return teleplay;
	}

}

const TeleplayKeyValueMap: Map<string, string> = new Map(
	[['制片国家/地区:', 'country'],
		['语言:', 'language'],
		['集数:', 'episode'],
		['单集片长:', 'time'],
		['又名:', 'aliases'],
		['IMDb:', 'IMDb']
	]
);
