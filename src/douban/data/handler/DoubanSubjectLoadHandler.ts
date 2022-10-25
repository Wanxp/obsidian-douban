import { DoubanPluginSettings } from "src/douban/Douban";
import DoubanSubject from "../model/DoubanSubject";
import { Editor } from "obsidian";

export default interface DoubanSubjectLoadHandler<T extends DoubanSubject> {
    
    parse(extract: T, settings:DoubanPluginSettings): string;

    support(extract:DoubanSubject):boolean;

    handle(url:string, editor: Editor):void;


}
