import { App, Editor } from "obsidian";

import DoubanMovieLoadHandler from "./DoubanMovieLoadHandler";
import DoubanOtherLoadHandler from "./DoubanOtherLoadHandler";
import DoubanPlugin from "main";
import { DoubanPluginSettings } from "douban/Douban";
import DoubanSubject from "../model/DoubanSubject";
import DoubanSubjectLoadHandler from "./DoubanSubjectLoadHandler";

export class DoubanEtractHandler {

    private _app:App;
    private _doubanPlugin:DoubanPlugin;
    private _doubanSubjectHandlers:DoubanSubjectLoadHandler<DoubanSubject>[];
    private _doubanSubjectHandlerDefault:DoubanSubjectLoadHandler<DoubanSubject>;



    constructor(app:App, doubanPlugin:DoubanPlugin) {
        this._app = app;
        this._doubanPlugin = doubanPlugin;
        this._doubanSubjectHandlerDefault = new DoubanOtherLoadHandler(doubanPlugin);
        this._doubanSubjectHandlers = [new DoubanMovieLoadHandler(doubanPlugin),
             this._doubanSubjectHandlerDefault];

    }

    public handle(searchExtract:DoubanSubject, editor: Editor):void{
        if(!searchExtract) {
            return;
        }
        var doubanSubjectHandlers:DoubanSubjectLoadHandler<DoubanSubject>[] = this._doubanSubjectHandlers
        .filter(h => h.support);
        if(doubanSubjectHandlers && doubanSubjectHandlers.length > 0) {
            var result = doubanSubjectHandlers.map(h => h.handle(searchExtract.url, editor))
            if(result && result.length > 0) {
                return result[0];
            }
        }else {
            this._doubanSubjectHandlerDefault.handle(searchExtract.url, editor);
        }    
    }

    public parseText(template: string, arraySpilt:string, extract:DoubanSubject):string {
        if(!template) {
            return "";
        }
        var doubanSubjectHandlers:DoubanSubjectLoadHandler<DoubanSubject>[] = this._doubanSubjectHandlers
            .filter(h => h.support);
        if(doubanSubjectHandlers && doubanSubjectHandlers.length > 0) {
            var result = doubanSubjectHandlers.map(h => h.parseText(template, arraySpilt, extract));
            if(result && result.length > 0) {
                return result[0];
            }else {
                return "";
            }
        }else {
            return this._doubanSubjectHandlerDefault.parseText(template, arraySpilt, extract);
        }    

    }

}

