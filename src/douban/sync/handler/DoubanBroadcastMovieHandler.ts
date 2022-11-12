import {CheerioAPI} from "cheerio";
import {DoubanBroadcastAbstractHandler} from "./DoubanBroadcastAbstractHandler";
import DoubanBroadcastMovieSubject from "../model/DoubanBroadcastMoveSubject";

//TODO will support in future version
export class DoubanBroadcastMovieHandler extends DoubanBroadcastAbstractHandler<DoubanBroadcastMovieSubject> {
	support(t: string): boolean {
		throw new Error("Method not implemented.");
	}

	transform(data: Element, source: CheerioAPI): DoubanBroadcastMovieSubject {
		throw new Error("Method not implemented.");
	}


}
