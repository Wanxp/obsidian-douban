import  DoubanPlugin  from "main";
import { FuzzySuggestModal,App } from "obsidian";
import { log } from "utils/logutil";
import { DoubanSearchResultExtract } from "./SearchParser";


export {DoubanFuzzySuggester}


class DoubanFuzzySuggester extends FuzzySuggestModal<DoubanSearchResultExtract> {

    public app: App;
    private plugin: DoubanPlugin;
    private doubanSearchResultExtract:DoubanSearchResultExtract[]

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

    getItems(): DoubanSearchResultExtract[] {
        return this.doubanSearchResultExtract;
    }

    getItemText(item: DoubanSearchResultExtract): string {
        let text:string = item.type + "/"  + item.score + "/" + item.title + "/" + item.cast;
        return text;
    }

    onChooseItem(item: DoubanSearchResultExtract, evt: MouseEvent | KeyboardEvent): void {
        this.plugin.geDoubanMovieTextForSearchTerm
    }

    public showSearchList(doubanSearchResultExtractList:DoubanSearchResultExtract[]) {
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