import  { CheerioAPI } from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanPlugin from "main";
import { DoubanPluginSettings } from "src/douban/Douban";
import SchemaOrg from "src/utils/SchemaOrg";
import { moment } from "obsidian";
import DoubanSubject from '../model/DoubanSubject';
import DoubanGameSubject from '../model/DoubanGameSubject';

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

    parseSubjectFromHtml(data: CheerioAPI): DoubanGameSubject {
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

                    const result:DoubanGameSubject = {
						id: id ? id[0] : '',
						type: 'Game',
						title: title,
						desc: obj.description,
						url: "https://movie.douban.com" + obj.url,
						datePublished: obj.datePublished ? new Date(obj.datePublished) : undefined,
						image: obj.image,
						genre: obj.genre,
						aliases: [],
						developer: '',
						platform: [],
						score: undefined,
						publisher: ''
					}
            return result;
        })[0];
    }

}


