import DoubanSearchResultSubject from "douban/model/DoubanSearchResultSubject";
import  DoubanPlugin  from "main";
import { FuzzySuggestModal,App, Editor } from "obsidian";
import { log } from "utils/logutil";


export {DoubanFuzzySuggester}


class DoubanFuzzySuggester extends FuzzySuggestModal<DoubanSearchResultSubject> {

    public editor: Editor;
    private plugin: DoubanPlugin;
    private doubanSearchResultExtract:DoubanSearchResultSubject[]

    constructor(plugin: DoubanPlugin, editor: Editor) {
        super(app);
        this.editor = editor;
        this.plugin = plugin;
        this.setPlaceholder("Choose an item...");

        // this.inputEl.addEventListener("keydown", (event) => {
        //     if (event.key === "Enter") {
        //         log.info("enter")
        //       this.reloadSearch();
        //     }
        //   })

    }



    getItems(): DoubanSearchResultSubject[] {
        return this.doubanSearchResultExtract;
    }

    getItemText(item: DoubanSearchResultSubject): string {
        let text:string = item.type + "/"  + item.score + "/" + item.title + "/" + item.cast;
        return text;
    }

    onChooseItem(item: DoubanSearchResultSubject, evt: MouseEvent | KeyboardEvent): void {
        log.warn(`choose itme ${JSON.stringify(item)}`);
        this.plugin.doubanEtractHandler.handle(item, this.editor);
    }

    public showSearchList(doubanSearchResultExtractList:DoubanSearchResultSubject[]) {
        this.doubanSearchResultExtract = doubanSearchResultExtractList;
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