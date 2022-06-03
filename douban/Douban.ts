import { type } from "os";

interface DoubanPluginSettings {
    template:string,
    searchUrl:string,
    searchHeaders?:string
}


export const doubanHeadrs = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
};

export const DEFAULT_SETTINGS:DoubanPluginSettings = {
    template: 
    "---\n" + 
    "title: {{title}}" +
    "cast: {{cast}}" +
    "score: {{score}}\n" + 
    "---",
    searchUrl: 'https://www.douban.com/search?q=',
    searchHeaders: JSON.stringify(doubanHeadrs)

}


export type {DoubanPluginSettings}