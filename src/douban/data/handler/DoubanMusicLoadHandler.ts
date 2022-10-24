import  { CheerioAPI } from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanMusicSubject from '../model/DoubanMusicSubject';
import DoubanPlugin from "main";
import { DoubanPluginSettings } from "src/douban/Douban";
import { moment } from "obsidian";
import DoubanSubject from '../model/DoubanSubject';

export default class DoubanMusicLoadHandler extends DoubanAbstractLoadHandler<DoubanMusicSubject> {

    parseText(extract: DoubanMusicSubject, settings:DoubanPluginSettings): string {
		return settings.bookTemplate ? settings.musicTemplate
        .replaceAll("{{id}}", extract.id)
		.replaceAll("{{type}}", extract.type ? extract.type : "")
		.replaceAll("{{title}}", extract.title ? extract.title : "")
		.replaceAll("{{desc}}", extract.desc ? extract.desc : "")
		.replaceAll("{{image}}", extract.image  ? extract.image : "")
		.replaceAll("{{actor}}", extract.actor  ? extract.actor.join(settings.arraySpilt) : "")
		.replaceAll("{{datePublished}}", extract.datePublished  ?  moment(extract.datePublished).format(settings.dateFormat) : "")
		.replaceAll("{{url}}", extract.url  ? extract.url : "")
		.replaceAll("{{score}}", extract.score && extract.score ? extract.score + "" : "")
		.replaceAll("{{barcode}}", extract.barcode  ? extract.barcode : "")
		.replaceAll("{{publish}}", extract.publish  ? extract.publish : "")
		.replaceAll("{{genre}}", extract.genre  ? extract.genre : "")
        .replaceAll("{{medium}}", extract.medium  ? extract.medium : "")
        .replaceAll("{{albumType}}", extract.albumType  ? extract.albumType : "")
		.replaceAll("{{numberOfRecords}}", extract.numberOfRecords  ? extract.numberOfRecords + "" : "")
		: undefined;    
    }
    support(extract: DoubanSubject): boolean {
        return extract && extract.type && (extract.type.contains("音乐") || extract.type.contains("Music") || extract.type.contains("music"));
    }



    

    constructor(doubanPlugin:DoubanPlugin) {
        super(doubanPlugin);
    }

    parseSubjectFromHtml(html: CheerioAPI): DoubanMusicSubject {
        var title = html(html("head > meta[property= 'og:title']").get(0)).attr("content");
        var desc = html(html("head > meta[property= 'og:description']").get(0)).attr("content");
        var url = html(html("head > meta[property= 'og:url']").get(0)).attr("content");
        var image = html(html("head > meta[property= 'og:image']").get(0)).attr("content");
        var score = html(html("#interest_sectl > div > div.rating_self.clearfix > strong[property= 'v:average']").get(0)).text();
        var detailDom = html(html("#info").get(0));
        var publish = detailDom.find("span.pl");

        var valueMap = new Map<string, string>();

        publish.map((index, info) => {
            let key = html(info).text().trim();
            let value = ''
            if(key.indexOf('表演者') >= 0){
                // value = html(info.next.next).text().trim();
                var vas:string[] = key.split("\n                                    \n                                    ");
                value = vas && vas.length > 1? vas[1]:"";    
                key = vas && vas.length > 0? vas[0]:"";
            }else{
                value = html(info.next).text().trim();
            }
            valueMap.set(BookKeyValueMap.get(key), value);
        })

        var idPattern = /(\d){5,10}/g;
        var id = idPattern.exec(url);

        const result:DoubanMusicSubject = {
            image: image,
            datePublished: valueMap.has('datePublished') ? new Date(valueMap.get('datePublished')) : null,
            publish: valueMap.has('publish') ? valueMap.get('publish') : "",
            score: Number(score),
            numberOfRecords: valueMap.has('numberOfRecords') ? Number(valueMap.get('numberOfRecords')) : null,
            id: id ? id[0] : "",
            type: "Music",
            title: title,
            desc: desc,
            url: url,
            actor: [valueMap.has('actor') ? valueMap.get('actor') : null],
            genre:  valueMap.has('genre') ? valueMap.get('genre') : "",
            albumType:  valueMap.has('albumType') ? valueMap.get('albumType') : "",
            medium:  valueMap.has('medium') ? valueMap.get('medium') : "",
            barcode:  valueMap.has('barcode') ? valueMap.get('barcode') : ""
        };
        return result;
}


}


const BookKeyValueMap:Map<string, string> = new Map(
    [['表演者:', 'actor'],
    ['流派:', 'genre'],
    ['发行时间:', 'datePublished'],
    ['专辑类型:', 'albumType'],
    ['介质:', 'medium'],
    ['出版者:', 'publish'],
    ['唱片数:', 'numberOfRecords'],
    ['条形码:', 'barcode']]
);