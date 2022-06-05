import DoubanSubject from "douban/model/DoubanSubject";
import { Editor } from "obsidian";

export default interface DoubanSubjectLoadHandler<T extends DoubanSubject> {
    
    parseText(template: string, arraySpilt:string, extract: DoubanSubject): string;

    support(extract:DoubanSubject):boolean;

    handle(url:string, editor: Editor):void;


}