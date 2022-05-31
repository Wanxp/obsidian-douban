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
    }

    getItems(): DoubanSearchResultExtract[] {
        return this.doubanSearchResultExtract;
    }

    getItemText(item: DoubanSearchResultExtract): string {
        let text:string = item.type + ":" + item.title + " [score]:" + item.score + ",[cast]:" + item.cast;
        return text;
    }

    onChooseItem(item: DoubanSearchResultExtract, evt: MouseEvent | KeyboardEvent): void {
        log.warn("choose item  " + item.title + " id " + item.id);
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