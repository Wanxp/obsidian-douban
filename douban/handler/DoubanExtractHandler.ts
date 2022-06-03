import DoubanPlugin from "main";
import { App } from "obsidian";
import DoubanMovieLoadHandler from "./DoubanMovieLoadHandler";
import DoubanOtherLoadHandler from "./DoubanOtherLoadHandler";
import DoubanSubjectLoadHandler from "./DoubanSubjectLoadHandler";
import DoubanSubject from "../model/DoubanSubject";

export class DoubanEtractHandler {

    private _app:App;
    private _doubanPlugin:DoubanPlugin;
    private _doubanSubjectHandlers:DoubanSubjectLoadHandler<DoubanSubject>[];

    constructor(app:App, doubanPlugin:DoubanPlugin) {
        this._app = app;
        this._doubanPlugin = doubanPlugin;
        this._doubanSubjectHandlers = [new DoubanMovieLoadHandler(this._doubanPlugin), 
            new DoubanOtherLoadHandler(this._doubanPlugin)];
    }

    public handle(searchExtract:DoubanSubject):void{
        if(!searchExtract) {
            return;
        }
        this._doubanSubjectHandlers
            .filter(h => h.support)
            .forEach(h => h.handle(searchExtract.url));
    }

}

