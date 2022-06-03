import { DoubanPluginSettings } from "douban/Douban";
import DoubanSubject from "douban/model/DoubanSubject";
import cheerio, { CheerioAPI } from "cheerio";
import { get, readStream } from "tiny-network";
import { log } from "utils/logutil";
import DoubanSubjectLoadHandler from "./DoubanSubjectLoadHandler";
import DoubanPlugin from "main";

export default abstract class DoubanAbstractLoadHandler<T extends DoubanSubject> implements DoubanSubjectLoadHandler<T> {
    
    
    doubanPlugin:DoubanPlugin;

    constructor(doubanPlugin:DoubanPlugin) {
        this.doubanPlugin = doubanPlugin;
    }
    
    handle(url:string):void {
       Promise
            .resolve()
            .then(() => get(url, JSON.parse(this.doubanPlugin.settings.searchHeaders)))
            .then(readStream)
            .then(log.info)
            .then(cheerio.load)
            .then(this.parseSubjectFromHtml);

    }

    abstract parseSubjectFromHtml(data:CheerioAPI):T | undefined;

    abstract getType(): string | undefined; 
    


    support(extract: DoubanSubject): boolean {
        return extract && (this.getType() == extract.type);
    }
    
}