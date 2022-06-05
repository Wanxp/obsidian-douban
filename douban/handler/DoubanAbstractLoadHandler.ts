import cheerio, { CheerioAPI } from "cheerio";
import { get, readStream } from "tiny-network";

import DoubanPlugin from "main";
import { DoubanPluginSettings } from "douban/Douban";
import DoubanSubject from "douban/model/DoubanSubject";
import DoubanSubjectLoadHandler from "./DoubanSubjectLoadHandler";
import { Editor } from "obsidian";
import HttpUtil from "utils/HttpUtil";
import { log } from "utils/logutil";

export default abstract class DoubanAbstractLoadHandler<T extends DoubanSubject> implements DoubanSubjectLoadHandler<T> {
    
    
    public doubanPlugin:DoubanPlugin;

    constructor(doubanPlugin:DoubanPlugin) {
        this.doubanPlugin = doubanPlugin;
    }

    abstract parseText(template: string, arraySpilt:string, extract: T): string;

    abstract support(extract: DoubanSubject): boolean;
    
    handle(url:string, editor:Editor):void {
        Promise.resolve().then(() => get(url + "/", {headers: JSON.parse(this.doubanPlugin.settings.searchHeaders)}))
            .then(readStream)
            .then(cheerio.load)  
            .then(this.parseSubjectFromHtml)
            .then(content => this.toEditor(editor, content))
            // .then(content => content ? editor.replaceSelection(content) : content)
        ;

    }


    abstract parseSubjectFromHtml(data:CheerioAPI):T | undefined;
    
    toEditor(editor:Editor, extract: T):T {
        this.doubanPlugin.putToEditor(editor, extract);
        return extract;
    }

}