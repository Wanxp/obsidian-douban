import { App, Editor, FuzzySuggestModal } from "obsidian";

import  DoubanPlugin  from "main";
import DoubanSearchResultSubject from "../model/DoubanSearchResultSubject";
import { log } from "src/utils/Logutil";

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

    }



    getItems(): DoubanSearchResultSubject[] {
        return this.doubanSearchResultExtract;
    }

    getItemText(item: DoubanSearchResultSubject): string {
        let text:string = item.type + "/"  + item.score + "/" + item.title + "/" + item.cast;
        return text;
    }

    onChooseItem(item: DoubanSearchResultSubject, evt: MouseEvent | KeyboardEvent): void {
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
