import DoubanPlugin from "main";
import { App } from "obsidian";
import DoubanMovieLoadHandler from "./handler/DoubanMovieLoadHandler";
import DoubanSubjectLoadHandler from "./handler/DoubanSubjectLoadHandler";
import DoubanSubject from "./model/DoubanSubject";

export class DoubanEtractHandler {

    private _app:App;
    private _doubanPlugin:DoubanPlugin;
    private _doubanSubjectHandlers:DoubanSubjectLoadHandler<DoubanSubject>[];

    public DoubanEtractHandler(app:App, doubanPlugin:DoubanPlugin) {
        this._app = app;
        this._doubanPlugin = doubanPlugin;
        this._doubanSubjectHandlers = [new DoubanMovieLoadHandler(), ]
    }

    public getSubjectTextById(searchExtract:DoubanSubject):string | undefined{
        if(!searchExtract) {
            return;
        }


    }

}

