import {SearchPageFetcherInterface} from "./SearchPageFetcherInterface";
import {AllPageSearchPageFetcher} from "./AllPageSearchPageFetcher";
import SettingsManager from "../../../setting/SettingsManager";
import {SupportType} from "../../../../constant/Constsant";
import {MoviePageSearchPageFetcher} from "./MoviePageSearchPageFetcher";
import {BookPageSearchPageFetcher} from "./BookPageSearchPageFetcher";
import {GamePageSearchPageFetcher} from "./GamePageSearchPageFetcher";
import {MusicPageSearchPageFetcher} from "./MusicPageSearchPageFetcher";
import {TheaterPageSearchPageFetcher} from "./TheaterPageSearchPageFetcher";
import {NotePageSearchPageFetcher} from "./NotePageSearchPageFetcher";
import {NoteFirstPageSearchPageFetcher} from "./NoteFirstPageSearchPageFetcher";

export class SearchPageFetcher {

	private fetchers:SearchPageFetcherInterface[] = [];

	constructor(settingsManager:SettingsManager) {
		this.fetchers.push(new AllPageSearchPageFetcher(settingsManager));
		this.fetchers.push(new MoviePageSearchPageFetcher(settingsManager));
		this.fetchers.push(new BookPageSearchPageFetcher(settingsManager));
		this.fetchers.push(new GamePageSearchPageFetcher(settingsManager));
		this.fetchers.push(new MusicPageSearchPageFetcher(settingsManager));
		this.fetchers.push(new TheaterPageSearchPageFetcher(settingsManager));
		this.fetchers.push(new NotePageSearchPageFetcher(settingsManager));
		this.fetchers.push(new NoteFirstPageSearchPageFetcher(settingsManager));


	}

	fetch(keyword:string, type:SupportType, pageNum:number, pageSize:number):Promise<string> {
		for (const fetcher of this.fetchers) {
			if (fetcher.support(type, pageNum)) {
				return fetcher.fetch(keyword, pageNum, pageSize);
			}
		}
		throw new Error(`not support type:${type} pageNum:${pageNum}`);
	}


}
