import {CheerioAPI} from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanPlugin from "../../../main";
import SchemaOrg from "src/org/wanxp/utils/SchemaOrg";
import DoubanSubject from '../model/DoubanSubject';
import HandleContext from "../model/HandleContext";
import {PropertyName, SupportType} from "../../../constant/Constsant";
import {UserStateSubject} from "../model/UserStateSubject";
import {moment} from "obsidian";
import {TITLE_ALIASES_SPECIAL_CHAR_REG_G} from "../../../utils/YamlUtil";
import DoubanTheaterSubject from "../model/DoubanTheaterSubject";

export default class DoubanTheaterLoadHandler extends DoubanAbstractLoadHandler<DoubanTheaterSubject> {
	constructor(doubanPlugin: DoubanPlugin) {
		super(doubanPlugin);
	}

	getSupportType(): SupportType {
		return SupportType.THEATER;
	}

	getHighQuantityImageUrl(fileName: string): string {
		return `https://img9.doubanio.com/view/photo/l/public/${fileName}`;
	}

	getSubjectUrl(id:string):string{
		return `https://www.douban.com/location/drama/${id}/`;
	}

	parseText(beforeContent: string, extract: DoubanTheaterSubject, context: HandleContext): string {
		return beforeContent
			.replaceAll("{{originalTitle}}", extract.originalTitle ? extract.originalTitle : "")
			.replaceAll("{{director}}", this.handleArray(extract.director.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, context)).filter(c => c), context))
			.replaceAll("{{actor}}", this.handleArray(extract.actor.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, context)).filter(c => c), context))
			.replaceAll("{{author}}", this.handleArray(extract.author.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, context)).filter(c => c), context))
			.replaceAll("{{aliases}}", this.handleArray(extract.aliases.map(a => a.replace(TITLE_ALIASES_SPECIAL_CHAR_REG_G, '_')), context))
			.replaceAll("{{language}}", this.handleArray(extract.language, context))
			;
	}

	support(extract: DoubanSubject): boolean {
		return extract && extract.type && (extract.type.contains("舞台剧") || extract.type.contains("舞剧") || extract.type.contains("Theater") || extract.type.contains("theater"));
	}

	analysisUser(html: CheerioAPI, context: HandleContext): { data: CheerioAPI, userState: UserStateSubject } {
		let rate = html('input#n_rating').val();
		let tagsStr = html('div#interest_sect_level > div.a_stars > span.color_gray').text().trim();
		let tags = tagsStr ? tagsStr.replace('标签:', '').trim().split(' ') : null;
		let stateWord = html('#interest_sect_level > h2').text().trim();
		let collectionDateStr = html('div#interest_sect_level > div.a_stars > span.mr10 > span.collection_date').text().trim();
		let userState1 = DoubanAbstractLoadHandler.getUserState(stateWord);
		let component = this.getPropertyValue(html, PropertyName.comment);
		const userState: UserStateSubject = {
			tags: tags,
			rate: rate ? Number(rate) : null,
			state: userState1,
			collectionDate: collectionDateStr ? moment(collectionDateStr, 'YYYY-MM-DD').toDate() : null,
			comment: component
		}
		return {data: html, userState: userState};
	}

	parseSubjectFromHtml(html: CheerioAPI, context: HandleContext): DoubanTheaterSubject {
		const obj: DoubanTheaterSubject = new DoubanTheaterSubject();
		obj.id = this.getPropertyValue(html, PropertyName.id);
		return obj;
	}
}
