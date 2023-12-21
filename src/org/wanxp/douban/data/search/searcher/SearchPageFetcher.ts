import {SearchPageFetcherInterface} from "./SearchPageFetcherInterface";
import {AllPageSearchPageFetcher} from "./AllPageSearchPageFetcher";
import SettingsManager from "../../../setting/SettingsManager";
import {SupportType} from "../../../../constant/Constsant";
import {MoviePageSearchPageFetcher} from "./MoviePageSearchPageFetcher";
import {BookPageSearchPageFetcher} from "./BookPageSearchPageFetcher";

export class SearchPageFetcher {

	private fetchers:SearchPageFetcherInterface[] = [];

	constructor(settingsManager:SettingsManager) {
		this.fetchers.push(new AllPageSearchPageFetcher(settingsManager));
		this.fetchers.push(new MoviePageSearchPageFetcher(settingsManager));
		this.fetchers.push(new BookPageSearchPageFetcher(settingsManager))
	}

	fetch(keyword:string, type:SupportType, pageNum:number, pageSize:number):Promise<string> {
		for (const fetcher of this.fetchers) {
			if (fetcher.support(type)) {
				return fetcher.fetch(keyword, pageNum, pageSize);
			}
		}
		throw new Error(`not support type:${type} pageNum:${pageNum}`);
	}


}
