import { i18nHelper } from "lang/helper";
import { type } from "os";

export interface DoubanPluginSettings {
    movieTemplate:string,
    bookTemplate:string,
    dateFormat:string,
    searchUrl:string,
    arraySpilt:string,
    searchHeaders?:string,
    personNameMode:PersonNameMode,
}

export enum PersonNameMode {
    CH_NAME = "CH",
    EN_NAME = "EN",
    CH_EN_NAME = "CH_EN",
}


export const doubanHeadrs = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
};

export const DEFAULT_SETTINGS:DoubanPluginSettings = {
    movieTemplate: 
`![image]({{image}})
doubanId: {{id}}
title: {{title}}
type: {{type}}
score: {{score}}
datePublished: {{datePublished}}
director: {{director}}
actor: {{actor}}
author: {{author}}
url: {{url}}
desc: {{desc}}
`,
    bookTemplate: 
`---
doubanId: {{id}}
title: {{title}}
subTitle: {{subTitle}}
originalTitle: {{originalTitle}}
type: {{type}}
author: {{author}}
score: {{score}}
datePublished: {{datePublished}}
translator: {{translator}}
publish: {{publish}}
isbn: {{isbn}}
url: {{url}}
totalPage: {{totalPage}}
price: {{price}}
tags: Book
desc: {{desc}}
---
![image|150]({{image}})
`,
// totalWord: {{totalWord}}

    searchUrl: 'https://www.douban.com/search?q=',
    searchHeaders: JSON.stringify(doubanHeadrs),
    dateFormat: "yyyy_MM_DD",
    arraySpilt: ", ",
    personNameMode: PersonNameMode.CH_NAME

}

export const personNameModeRecords: {[key in PersonNameMode]: string} = {
    [PersonNameMode.CH_NAME]: i18nHelper.getMessage("Chinese Name"),
    [PersonNameMode.EN_NAME]: i18nHelper.getMessage("English Name"),
    [PersonNameMode.CH_EN_NAME]: i18nHelper.getMessage("Chinese And English Name"),
  }
  

