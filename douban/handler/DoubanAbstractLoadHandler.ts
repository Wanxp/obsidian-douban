import { DoubanPluginSettings } from "douban/Douban";
import DoubanSubject from "douban/model/DoubanSubject";
import DoubanSubjectLoadHandler from "./DoubanSubjectLoadHandler";

export default abstract class DoubanAbstractLoadHandler<T extends DoubanSubject> implements DoubanSubjectLoadHandler<T> {
    
    
    doubanSettings:DoubanPluginSettings;

    DoubanAbstractLoadHandler(doubanSettings:DoubanPluginSettings) {
        this.doubanSettings = doubanSettings;
    }
    
    abstract getSubject(url:string): T;
    abstract getTextResult(url:string): string;
    abstract getType(): string; 
    


    support(extract: DoubanSubject): boolean {
        return extract && (this.getType() == extract.type);
    }
    
}