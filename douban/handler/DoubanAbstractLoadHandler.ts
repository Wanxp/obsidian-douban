import { DoubanPluginSettings, PersonNameMode } from "douban/Douban";
import cheerio, { CheerioAPI } from "cheerio";
import { get, readStream } from "tiny-network";

import DoubanPlugin from "main";
import DoubanSubject from "douban/model/DoubanSubject";
import DoubanSubjectLoadHandler from "./DoubanSubjectLoadHandler";
import { Editor } from "obsidian";
import HttpUtil from "utils/HttpUtil";
import { json } from "stream/consumers";
import { log } from "utils/Logutil";

export default abstract class DoubanAbstractLoadHandler<T extends DoubanSubject> implements DoubanSubjectLoadHandler<T> {
    
    
    public doubanPlugin:DoubanPlugin;

    constructor(doubanPlugin:DoubanPlugin) {
        this.doubanPlugin = doubanPlugin;
    }

    abstract parseText(extract: T, settings:DoubanPluginSettings): string;

    abstract support(extract: DoubanSubject): boolean;
    
    handle(url:string, editor:Editor):void {
        Promise.resolve().then(() => get(log.traceN("GET URL", url + "/"), log.traceN("GET HEAD", {headers: JSON.parse(this.doubanPlugin.settings.searchHeaders)})))
            .then(readStream)
            .then(cheerio.load)  
            .then(log.trace)
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

    getPersonName(name:string, settings:DoubanPluginSettings):string {
        if(!name || !settings || !settings.personNameMode) {
            return "";
        }
        var resultName = "";
        switch(settings.personNameMode) {
            case PersonNameMode.CH_NAME:
                var regValue = /[\u4e00-\u9fa5]{2,20}/g.exec(name);
                resultName = regValue?regValue[0]:name;
                break;
            case PersonNameMode.EN_NAME:
                var regValue = /[a-zA-Z.\s\-]{2,50}/g.exec(name);
                resultName = regValue?regValue[0]:name;
                break;
            default:
                resultName = name;
        }
        return resultName;
    }

     html_encode(str:string):string 
    { 
        var s = ""; 
        if (str.length == 0) return ""; 
        s = str.replace(/&/g, "&amp;"); 
        s = s.replace(/</g, "&lt;"); 
        s = s.replace(/>/g, "&gt;"); 
        s = s.replace(/ /g, "&nbsp;"); 
        s = s.replace(/\'/g, "&#39;"); 
        s = s.replace(/\"/g, "&quot;"); 
            s = s.replace(/\n/g, "<br/>"); 
        return s; 
    } 

     html_decode(str:string):string 
    { 
        var s = ""; 
        if (str.length == 0) return ""; 
        s = str.replace(/&amp;/g, "&"); 
        s = s.replace(/&lt;/g, "<"); 
        s = s.replace(/&gt;/g, ">"); 
        s = s.replace(/&nbsp;/g, " "); 
        s = s.replace(/&#39;/g, "\'"); 
        s = s.replace(/&quot;/g, "\""); 
        s = s.replace(/<br\/>/g, "\n"); 
        return s; 
    } 

}