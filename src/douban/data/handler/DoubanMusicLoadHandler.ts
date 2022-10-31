import {CheerioAPI} from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanMusicSubject from '../model/DoubanMusicSubject';
import DoubanPlugin from "main";
import {DoubanPluginSettings} from "src/douban/Douban";
import DoubanSubject from '../model/DoubanSubject';

export default class DoubanMusicLoadHandler extends DoubanAbstractLoadHandler<DoubanMusicSubject> {

	constructor(doubanPlugin: DoubanPlugin) {
		super(doubanPlugin);
	}

	getTemplate(settings: DoubanPluginSettings): string {
		return settings.musicTemplate;
	}

	parseText(beforeContent: string, extract: DoubanMusicSubject, settings: DoubanPluginSettings): string {
		return beforeContent
			.replaceAll("{{actor}}", extract.actor ? extract.actor.join(settings.arraySpilt) : "")
			.replaceAll("{{barcode}}", extract.barcode ? extract.barcode : "")
			.replaceAll("{{medium}}", extract.medium ? extract.medium : "")
			.replaceAll("{{albumType}}", extract.albumType ? extract.albumType : "")
			.replaceAll("{{records}}", extract.records ? extract.records + "" : "")
			;
	}

	support(extract: DoubanSubject): boolean {
		return extract && extract.type && (extract.type.contains("音乐") || extract.type.contains("Music") || extract.type.contains("music"));
	}

	parseSubjectFromHtml(html: CheerioAPI): DoubanMusicSubject {
		let title = html(html("head > meta[property= 'og:title']").get(0)).attr("content");
		let desc = html(html("head > meta[property= 'og:description']").get(0)).attr("content");
		let url = html(html("head > meta[property= 'og:url']").get(0)).attr("content");
		let image = html(html("head > meta[property= 'og:image']").get(0)).attr("content");
		let score = html(html("#interest_sectl > div > div.rating_self.clearfix > strong[property= 'v:average']").get(0)).text();
		let detailDom = html(html("#info").get(0));
		let publish = detailDom.find("span.pl");

		let valueMap = new Map<string, string>();

		publish.map((index, info) => {
			let key = html(info).text().trim();
			let value = ''
			if (key.indexOf('表演者') >= 0) {
				// value = html(info.next.next).text().trim();
				let vas: string[] = key.split("\n                                    \n                                    ");
				value = vas && vas.length > 1 ? vas[1] : "";
				key = vas && vas.length > 0 ? vas[0] : "";
			} else {
				value = html(info.next).text().trim();
			}
			valueMap.set(MusicKeyValueMap.get(key), value);
		})

		let idPattern = /(\d){5,10}/g;
		let id = idPattern.exec(url);

		const result: DoubanMusicSubject = {
			image: image,
			datePublished: valueMap.has('datePublished') ? new Date(valueMap.get('datePublished')) : undefined,
			publisher: valueMap.has('publisher') ? valueMap.get('publisher') : "",
			score: Number(score),
			records: valueMap.has('records') ? Number(valueMap.get('records')) : null,
			id: id ? id[0] : "",
			type: "Music",
			title: title,
			desc: desc,
			url: url,
			actor: [valueMap.has('actor') ? valueMap.get('actor') : null],
			genre: valueMap.has('genre') ? [valueMap.get('genre')] : [""],
			albumType: valueMap.has('albumType') ? valueMap.get('albumType') : "",
			medium: valueMap.has('medium') ? valueMap.get('medium') : "",
			barcode: valueMap.has('barcode') ? valueMap.get('barcode') : ""
		};
		return result;
	}


}


const MusicKeyValueMap: Map<string, string> = new Map(
	[['表演者:', 'actor'],
		['流派:', 'genre'],
		['发行时间:', 'datePublished'],
		['专辑类型:', 'albumType'],
		['介质:', 'medium'],
		['出版者:', 'publisher'],
		['唱片数:', 'records'],
		['条形码:', 'barcode']]
);
