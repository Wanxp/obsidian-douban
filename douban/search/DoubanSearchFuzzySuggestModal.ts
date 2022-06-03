import DoubanSearchResultSubject from "douban/model/DoubanSearchResultSubject";
import  DoubanPlugin  from "main";
import { FuzzySuggestModal,App } from "obsidian";
import { log } from "utils/logutil";


export {DoubanFuzzySuggester}


class DoubanFuzzySuggester extends FuzzySuggestModal<DoubanSearchResultSubject> {

    public app: App;
    private plugin: DoubanPlugin;
    private doubanSearchResultExtract:DoubanSearchResultSubject[]

    constructor(app: App, plugin: DoubanPlugin) {
        super(app);
        this.app = app;
        this.plugin = plugin;
        this.setPlaceholder("Choose an item...");

        // this.inputEl.addEventListener("keydown", (event) => {
        //     if (event.key === "Enter") {
        //         log.info("enter")
        //       this.reloadSearch();
        //     }
        //   })

    }

    async reloadSearch() {
        if(this.inputEl.value) {
            log.info("reload search")
            this.doubanSearchResultExtract = await this.plugin.getDoubanSearchList(this.inputEl.value);
        }
    }

    getItems(): DoubanSearchResultSubject[] {
        return this.doubanSearchResultExtract;
    }

    getItemText(item: DoubanSearchResultSubject): string {
        let text:string = item.type + "/"  + item.score + "/" + item.title + "/" + item.cast;
        return text;
    }

    onChooseItem(item: DoubanSearchResultSubject, evt: MouseEvent | KeyboardEvent): void {
        this.plugin.doubanEtractHandler.handle(item);
    }

    public showSearchList(doubanSearchResultExtractList:DoubanSearchResultSubject[]) {
        this.doubanSearchResultExtract = doubanSearchResultExtractList;
        log.info("show search result" );
        this.start();
    }

    public start(): void {
        try {
            this.open();
        } catch (e) {
            log.error(e);
        }
    }

}