import {
	DoubanSearchGroupPublishResultSubjectNextPage, DoubanSearchGroupPublishResultSubjectPreviousPage,
	DoubanSearchResultSubjectNextPage,
	DoubanSearchResultSubjectNextPageNeedLogin,
	DoubanSearchResultSubjectPreviousPage,
	NavigateType, SEARCH_ITEM_PAGE_SIZE, SupportType
} from "../../../constant/Constsant";
import {FuzzySuggestModal, RequestUrlParam, request} from "obsidian";

import DoubanPlugin from "../../../main";
import DoubanSearchResultSubject from "../model/DoubanSearchResultSubject";
import HandleContext from "../model/HandleContext";
import {SearchPage} from "../model/SearchPage";
import {SearchPageInfo} from "../model/SearchPageInfo";
import {i18nHelper} from "../../../lang/helper";
import {log} from "src/org/wanxp/utils/Logutil";
import SearcherV2 from "./SearchV2";

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

	async onChooseItem(item: DoubanSearchResultSubject, evt: MouseEvent | KeyboardEvent):Promise<void>  {
		if(this.isNavigate(item)) {
			if (await this.handleNavigate(item)) {
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
		switch (item.url) {
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
		if (result) {
			const searchPageResult: SearchPage =
				await SearcherV2.search(this.searchItem, currentPage.type, currentPage.pageNum, SEARCH_ITEM_PAGE_SIZE, this.plugin.settings, this.plugin.settingsManager);
			this.context.searchPage = searchPageResult;
			this.updatePageResult(searchPageResult);
		}
		return result;
	}

	private updatePageResult(searchPageResult: SearchPage) {
		this.initItems(searchPageResult);

	}



	public showSearchPage(searchPage: SearchPage) {
		this.initItems(searchPage);
		this.start();
	}

	private initItems(searchPage: SearchPage) {
		const doubanList: DoubanSearchResultSubject[] = searchPage.list;
		if (searchPage.hasNext) {
			if (this.plugin.userComponent.isLogin()) {
				if (searchPage.type == SupportType.ALL && searchPage.pageNum == 1) {
					doubanList.push(DoubanSearchGroupPublishResultSubjectNextPage)
				}else {
					doubanList.push(DoubanSearchResultSubjectNextPage)
				}
			}else {
				doubanList.push(DoubanSearchResultSubjectNextPageNeedLogin)
			}
		}
		if (searchPage.hasPrevious) {
			if (searchPage.type == SupportType.ALL && searchPage.pageNum == 2) {
				doubanList.unshift(DoubanSearchGroupPublishResultSubjectPreviousPage)
			}else {
				doubanList.unshift(DoubanSearchResultSubjectPreviousPage);
			}
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
