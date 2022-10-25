import  { CheerioAPI } from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanPlugin from "main";
import { DoubanPluginSettings } from "src/douban/Douban";
import SchemaOrg from "src/utils/SchemaOrg";
import { moment } from "obsidian";
import DoubanSubject from '../model/DoubanSubject';
import DoubanGameSubject from '../model/DoubanGameSubject';
import DoubanBookSubject from "@App/data/model/DoubanBookSubject";

export default class DoubanGameLoadHandler extends DoubanAbstractLoadHandler<DoubanGameSubject> {

	getTemplate(settings: DoubanPluginSettings): string {
		return settings.gameTemplate;
	}

    parseText(beforeContent:string, extract: DoubanGameSubject, settings:DoubanPluginSettings): string {
		return beforeContent.replaceAll("{{platform}}", extract.platform  ? extract.platform.join(settings.arraySpilt) : "");
    }

    support(extract: DoubanSubject): boolean {
        return extract && extract.type && (extract.type.contains("游戏") || extract.type.contains("Game") || extract.type.contains("game"));
    }



    

    constructor(doubanPlugin:DoubanPlugin) {
        super(doubanPlugin);
    }

    parseSubjectFromHtml(html: CheerioAPI): DoubanGameSubject {
		let title = html(html("#content > h1").get(0)).text();
		let idContent = html(html("head > meta[name= 'mobile-agent']").get(0)).attr("content");
		let idPattern = /(\d){5,10}/g;
		let idP = idPattern.exec(idContent);
		let id = idP ? idP[0] : "";
		let score = html(html("#interest_sectl > div > div.rating_self.clearfix > strong[property= 'v:average']").get(0)).text();
		let detailDom = html(html("dl.game-attr").get(0));
		let dt = detailDom.find("dt");
		let image = html(html("#content > div > div.article > div.mod.item-subject > div.item-subject-info > div > a > img").get(0)).attr("src");
		let desc = html(html("#link-report > p").get(0)).text();

		let url = `https://www.douban.com/game/${id}/`;
		let valueMap = new Map<string, any>();
		let value:any;
		dt.map((index, info) => {
			let key = html(info).text().trim();
			if(key.indexOf('平台') >= 0 || key.indexOf('类型') >= 0){
				html(info.next).find("a").map((index, a) => {
					value.push(html(a).text().trim());
				});
			}else{
				value = html(info.next).text().trim();
			}
			valueMap.set(GameKeyValueMap.get(key), value);
		})



		const result:DoubanGameSubject = {
			id: id,
			type: "Game",
			title: title,
			desc: desc,
			url: url,
			genre: valueMap.has('genre') ? valueMap.get('genre') : "",
			image: image,
			datePublished: valueMap.has('datePublished') ? new Date(valueMap.get('datePublished')) : null,
			publisher: valueMap.has('publisher') ? valueMap.get('publisher') : "",
			score: Number(score),
			aliases: valueMap.has('aliases') ? valueMap.get('aliases') : "",
			developer: valueMap.has('developer') ? valueMap.get('developer') : "",
			platform: valueMap.has('platform') ? valueMap.get('platform') : ""
		};
		return result
    }

}

const GameKeyValueMap:Map<string, string> = new Map(
	[['类型:', 'genre'],
		['平台:', 'platform'],
		['别名:', 'aliases'],
		['开发商:', 'developer'],
		['发行商:', 'publisher'],
		['发行日期:', 'datePublished'],
	]
);

