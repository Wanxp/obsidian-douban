
import {DoubanPluginSetting} from "../../setting/model/DoubanPluginSetting";
import {SearchPage} from "../model/SearchPage";
import SettingsManager from "../../setting/SettingsManager";
import {SupportType} from "../../../constant/Constsant";
import {SearchPageFetcher} from "./searcher/SearchPageFetcher";
import {SearchResultPageParser} from "./parser/SearchResultPageParser";

export default class SearcherV2 {
	static search(searchItem: string, searchType: SupportType, pageNum:number, pageSize:number, doubanSettings: DoubanPluginSetting, settingsManager:SettingsManager): Promise<SearchPage> {
		return new SearchPageFetcher(settingsManager)
			.fetch(searchItem, searchType, pageNum, pageSize)
			.then(e => new SearchResultPageParser()
				.parse(e, searchType, pageNum, pageSize));
	}

}
