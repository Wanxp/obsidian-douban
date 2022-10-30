import {CheerioAPI} from "cheerio";
import DoubanBroadcastSubject from "../model/DoubanBroadcastSubject";

export abstract class DoubanBroadcastAbstractHandler<T extends DoubanBroadcastSubject> {

	abstract support(t: string): boolean;

	abstract transform(data: Element, source: CheerioAPI): T;

}


