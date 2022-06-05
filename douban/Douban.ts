import { type } from "os";

interface DoubanPluginSettings {
    movieTemplate:string,
    dateFormat:string,
    searchUrl:string,
    arraySpilt:string,
    searchHeaders?:string,
}


export const doubanHeadrs = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
};

export const DEFAULT_SETTINGS:DoubanPluginSettings = {
    movieTemplate: 
    "---\n" + 
    "doubanId: {{id}}\n" + 
    "title: {{title}}\n" +
    "type: {{type}}\n" +
    "score: {{score}}\n" + 
    "datePublished: {{datePublished}}\n" + 
    "director: {{director}}\n" + 
    "actor: {{actor}}\n" + 
    "author: {{author}}\n" + 
    "url: {{url}}\n" + 
    "image: {{image}}\n" + 
    "---\n",
    searchUrl: 'https://www.douban.com/search?q=',
    searchHeaders: JSON.stringify(doubanHeadrs),
    dateFormat: "yyyy_MM_DD",
    arraySpilt: ", "



}


export class DefaultSettingsContent {

}

export type {DoubanPluginSettings}