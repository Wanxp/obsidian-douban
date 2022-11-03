import {CheerioAPI} from 'cheerio';
import DoubanAbstractLoadHandler from 'src/douban/data/handler/DoubanAbstractLoadHandler';
import DoubanNoteSubject from '../model/DoubanPageBroadcastSubject';
import DoubanPageBroadcastSubject from '../model/DoubanPageBroadcastSubject';
import DoubanPlugin from "main";
import DoubanSubject from 'src/douban/data/model/DoubanSubject';
import HandleContext from "@App/data/model/HandleContext";
import {TemplateKey} from "../../../constant/Constsant";

//TODO will support in future version
class DoubanPageBroadcatLoadHandler extends DoubanAbstractLoadHandler<DoubanPageBroadcastSubject> {

	constructor(doubanPlugin: DoubanPlugin) {
		super(doubanPlugin);
	}

	getTemplateKey(context: HandleContext): TemplateKey {
		return null;
	}

	parseText(beforeContent: string, extract: DoubanNoteSubject, context: HandleContext): string {
		return null;
	}

	support(extract: DoubanSubject): boolean {
		return extract && extract.type && (extract.type.contains("广播") || extract.type.contains("Broadcast"));
	}

	parseSubjectFromHtml(html: CheerioAPI): DoubanPageBroadcastSubject {
		return null;
	}


}
