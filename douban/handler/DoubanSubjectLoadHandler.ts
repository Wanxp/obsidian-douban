import { DoubanPluginSettings } from "douban/Douban";
import DoubanSubject from "douban/model/DoubanSubject";
import { Editor } from "obsidian";

export default interface DoubanSubjectLoadHandler<T extends DoubanSubject> {
    
    parseText(extract: T, settings:DoubanPluginSettings): string;

    support(extract:DoubanSubject):boolean;

    handle(url:string, editor: Editor):void;


}