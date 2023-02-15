import {FuzzySuggestModal, request, RequestUrlParam} from "obsidian";

import DoubanPlugin from "../../../main";
import DoubanSearchResultSubject from "../model/DoubanSearchResultSubject";
import {log} from "src/org/wanxp/utils/Logutil";
import {i18nHelper} from "../../../lang/helper";
import HandleContext from "../model/HandleContext";
import {init} from "cjs-module-lexer";
import {
	DoubanSearchResultSubjectNextPage,
	DoubanSearchResultSubjectNextPageNeedLogin, DoubanSearchResultSubjectPreviousPage, NavigateType
} from "../../../constant/Constsant";
import {SearchPageInfo} from "../model/SearchPageInfo";
import {flat} from "builtin-modules";
import User from "../../user/User";
import {load} from "cheerio";
import Searcher from "./Search";
import {SearchPage} from "../model/SearchPage";

export {DoubanFuzzySuggester}


class DoubanFuzzySuggester extends FuzzySuggestModal<DoubanSearchResultSubject> {

	private plugin: DoubanPlugin;
	private doubanSearchResultExtract: DoubanSearchResultSubject[];
	private context: HandleContext;
	private searchItem:string;

	constructor(plugin: DoubanPlugin, context: HandleContext, searchItem:string) {
		super(app);
		this.plugin = plugin;
		this.context = context;
		this.searchItem = searchItem;
		this.setPlaceholder(i18nHelper.getMessage('150101'));
	}


	getItems(): DoubanSearchResultSubject[] {
		return this.doubanSearchResultExtract;
	}

	getItemText(item: DoubanSearchResultSubject): string {
		if (this.isNavigate(item)) {
			return item.title;
		}
		let text: string = item.type + "/" + (item.score ? item.score : '-') + "/" + item.title + "/" + item.cast;
		return text;
	}

	private isNavigate(item: DoubanSearchResultSubject) {
		return item.type == "navigate";
	}

	onChooseItem(item: DoubanSearchResultSubject, evt: MouseEvent | KeyboardEvent): void {
		if(this.isNavigate(item)) {
			if (this.handleNavigate(item)) {
				this.start();
			}
			return;
		}
		this.plugin.showStatus(i18nHelper.getMessage('140204', item.title));
		this.context.listItem = item;
		if (item) {
			this.plugin.settingsManager.debug(`选择了:${item.type}:${item.id}:${item.title}`)
		}
		this.plugin.doubanExtractHandler.handle(item, this.context);
	}

	async handleNavigate(item: DoubanSearchResultSubject):Promise<boolean> {
		const {searchPage} = this.context;
		let currentPage:SearchPageInfo = searchPage;
		let result:boolean = false;
		switch (item.type) {
			case NavigateType.previous:
				currentPage = searchPage.previousPage();
				result = true;
				break;
			case NavigateType.next:
				currentPage = searchPage.nextPage();
				result = true;
				break;
			case NavigateType.nextNeedLogin:
				log.warn(i18nHelper.getMessage("140304"));
				break;
		}
		const searchPageResult:SearchPage = await Searcher.loadSearchItem(this.searchItem, currentPage.start, this.plugin.settings, this.plugin.settingsManager);
		this.updatePageResult(searchPageResult);
		this.context.searchPage = new SearchPageInfo(searchPageResult.total, currentPage.pageNum, searchPageResult.pageSize, searchPageResult.hasNext);
		return result;
	}

	private updatePageResult(searchPageResult: SearchPage) {
		this.initItems(searchPageResult.list);

	}



	public showSearchList(doubanSearchResultExtractList: DoubanSearchResultSubject[]) {
		this.initItems(doubanSearchResultExtractList);
		this.start();
	}

	private initItems(doubanSearchResultExtractList: DoubanSearchResultSubject[]) {
		let doubanList: DoubanSearchResultSubject[] = doubanSearchResultExtractList;
		const {searchPage} = this.context;
		if (searchPage.hasNext) {
			if (this.plugin.userComponent.isLogin()) {
				doubanList.push(DoubanSearchResultSubjectNextPage)
			}else {
				doubanList.push(DoubanSearchResultSubjectNextPageNeedLogin)
			}
		}
		if (searchPage.hasPrevious) {
			doubanList.unshift(DoubanSearchResultSubjectPreviousPage);
		}
		this.doubanSearchResultExtract = doubanList;

	}

	public start(): void {
		try {
			this.open();
		} catch (e) {
			log.error(e.toString(), e);
		}
	}

}
