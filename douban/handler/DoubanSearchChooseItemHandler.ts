import { App, Editor } from "obsidian";

import DoubanBookLoadHandler from "./DoubanBookLoadHandler";
import DoubanMovieLoadHandler from "./DoubanMovieLoadHandler";
import DoubanOtherLoadHandler from "./DoubanOtherLoadHandler";
import DoubanPlugin from "main";
import { DoubanPluginSettings } from "douban/Douban";
import DoubanSubject from "../model/DoubanSubject";
import DoubanSubjectLoadHandler from "./DoubanSubjectLoadHandler";

export class DoubanSearchChooseItemHandler {

    private _app:App;
    private _doubanPlugin:DoubanPlugin;
    private _doubanSubjectHandlers:DoubanSubjectLoadHandler<DoubanSubject>[];
    private _doubanSubjectHandlerDefault:DoubanSubjectLoadHandler<DoubanSubject>;



    constructor(app:App, doubanPlugin:DoubanPlugin) {
        this._app = app;
        this._doubanPlugin = doubanPlugin;
        this._doubanSubjectHandlerDefault = new DoubanOtherLoadHandler(doubanPlugin);
        this._doubanSubjectHandlers = [new DoubanMovieLoadHandler(doubanPlugin), new DoubanBookLoadHandler(doubanPlugin),
             this._doubanSubjectHandlerDefault];

    }

    public handle(searchExtract:DoubanSubject, editor: Editor):void{
        if(!searchExtract) {
            return;
        }
        var doubanSubjectHandlers:DoubanSubjectLoadHandler<DoubanSubject>[] = this._doubanSubjectHandlers
        .filter(h => h.support(searchExtract));
        if(doubanSubjectHandlers && doubanSubjectHandlers.length > 0) {
            doubanSubjectHandlers[0].handle(searchExtract.url, editor);
        }else {
            this._doubanSubjectHandlerDefault.handle(searchExtract.url, editor);
        }    
    }

    public parseText(extract:DoubanSubject, settings:DoubanPluginSettings):string {
        if(!settings) {
            return "";
        }
        var doubanSubjectHandlers:DoubanSubjectLoadHandler<DoubanSubject>[] = this._doubanSubjectHandlers
            .filter(h => h.support(extract));
        if(doubanSubjectHandlers && doubanSubjectHandlers.length > 0) {
            var result = doubanSubjectHandlers.map(h => h.parseText(extract, settings));
            if(result && result.length > 0) {
                return result[0];
            }else {
                return "";
            }
        }else {
            return this._doubanSubjectHandlerDefault.parseText(extract, settings);
        }    

    }

}

