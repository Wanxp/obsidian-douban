import {CheerioAPI} from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanPlugin from "../../../main";
import SchemaOrg from "src/org/wanxp/utils/SchemaOrg";
import DoubanSubject from '../model/DoubanSubject';
import HandleContext from "../model/HandleContext";
import {DataValueType, PropertyName, SupportType} from "../../../constant/Constsant";
import {UserStateSubject} from "../model/UserStateSubject";
import {moment} from "obsidian";
import {TITLE_ALIASES_SPECIAL_CHAR_REG_G} from "../../../utils/YamlUtil";
import DoubanTheaterSubject from "../model/DoubanTheaterSubject";
import {DataField} from "../../../utils/model/DataField";

export default class DoubanTheaterLoadHandler extends DoubanAbstractLoadHandler<DoubanTheaterSubject> {
	constructor(doubanPlugin: DoubanPlugin) {
		super(doubanPlugin);
	}

	getSupportType(): SupportType {
		return SupportType.theater;
	}

	getHighQuantityImageUrl(fileName: string): string {
		return `https://img9.doubanio.com/view/photo/l/public/${fileName}`;
	}

	getSubjectUrl(id:string):string{
		return `https://www.douban.com/location/drama/${id}/`;
	}

	parseVariable(beforeContent: string, variableMap:Map<string, DataField>, extract: DoubanTheaterSubject, context: HandleContext): void {
		variableMap.set("director", new DataField(
			"director",
			DataValueType.array,
			extract.director,
			extract.director.map(SchemaOrg.getPersonName).filter(c => c)
		));

		variableMap.set("actor", new DataField(
			"actor",
			DataValueType.array,
			extract.actor,
			extract.actor.map(SchemaOrg.getPersonName).filter(c => c)
		));

		variableMap.set("author", new DataField(
			"author",
			DataValueType.array,
			extract.author,
			extract.author.map(SchemaOrg.getPersonName).map(name => super.getPersonName(name, context)).filter(c => c)
		));

		variableMap.set("aliases", new DataField(
			"aliases",
			DataValueType.array,
			extract.aliases,
			extract.aliases.map(a => a
				.trim()
				.replace(TITLE_ALIASES_SPECIAL_CHAR_REG_G, '_')
				//replace multiple _ to single _
				.replace(/_+/g, '_')
				.replace(/^_/, '')
				.replace(/_$/, '')

			)
		));
	}

	support(extract: DoubanSubject): boolean {
		return extract && extract.type && (extract.type.contains("舞台剧") || extract.type.contains("舞剧") || extract.type.contains("Theater") || extract.type.contains("theater"));
	}

	analysisUser(html: CheerioAPI, context: HandleContext): { data: CheerioAPI, userState: UserStateSubject } {
		const rate = html('input#n_rating').val();
		const tagsStr = html('div#interest_sect_level > div.a_stars > span.color_gray').text().trim();
		const tags = tagsStr ? tagsStr.replace('标签:', '').trim().split(' ') : null;
		const stateWord = html('#interest_sect_level > h2').text().trim();
		const collectionDateStr = html('div#interest_sect_level > div.a_stars > span.mr10 > span.collection_date').text().trim();
		const userState1 = DoubanAbstractLoadHandler.getUserState(stateWord);
		const component = this.getPropertyValue(html, PropertyName.comment);
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
