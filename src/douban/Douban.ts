import { i18nHelper } from "src/lang/helper";
import { type } from "os";

export interface DoubanPluginSettings {
    movieTemplate:string,
    bookTemplate:string,
    musicTemplate:string,
    noteTemplate:string,
	gameTemplate:string,
    dateFormat:string,
	timeFormat:string,
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
`
![image]({{image}})

doubanId: {{id}}
title: {{title}}
type: {{type}}
score: {{score}}
originalTitle: {{originalTitle}}
genre: {{genre}}
datePublished: {{datePublished}}
director: {{director}}
actor: {{actor}}
author: {{author}}
url: {{url}}
desc: {{desc}}
`,
    bookTemplate: 
`![image|150]({{image}})

doubanId: {{id}}
title: {{title}}
subTitle: {{subTitle}}
originalTitle: {{originalTitle}}
type: {{type}}
author: {{author}}
score: {{score}}
datePublished: {{datePublished}}
translator: {{translator}}
publisher: {{publisher}}
isbn: {{isbn}}
url: {{url}}
totalPage: {{totalPage}}
price: {{price}}
tags: Book
desc: {{desc}}
`,
    musicTemplate: 
`
![image|150]({{image}})

doubanId: {{id}}
title: {{title}}
type: {{type}}
actor: {{actor}}
score: {{score}}
genre: {{genre}}
medium: {{medium}}
albumType: {{albumType}}
datePublished: {{datePublished}}
publisher: {{publisher}}
barcode: {{barcode}}
url: {{url}}
numberOfRecords: {{numberOfRecords}}
tags: Music
desc: {{desc}}
`,
noteTemplate: 
`---
doubanId: {{id}}
title: {{title}}
type: {{type}}  
author: [{{author}}]({{authorUrl}})
dateTimePublished: {{datePublished}} {{timePublished}}
url: {{url}}
tags: Article
desc: {{desc}}
---

{{content}}
`,
	gameTemplate:
		`![image]({{image}})
doubanId: {{id}}
title: {{title}}
originalTitle: {{originalTitle}}
type: {{type}}
score: {{score}}
genre: {{genre}}
datePublished: {{datePublished}}
director: {{director}}
actor: {{actor}}
author: {{author}}
url: {{url}}
desc: {{desc}}
`,
// totalWord: {{totalWord}}

    searchUrl: 'https://www.douban.com/search?q=',
    searchHeaders: JSON.stringify(doubanHeadrs),
    dateFormat: "yyyy-MM-DD",
	timeFormat: "HH:mm:ss",
	arraySpilt: ", ",
    personNameMode: PersonNameMode.CH_NAME

}

export const personNameModeRecords: {[key in PersonNameMode]: string} = {
    [PersonNameMode.CH_NAME]: i18nHelper.getMessage('121206'),
    [PersonNameMode.EN_NAME]: i18nHelper.getMessage('121207'),
    [PersonNameMode.CH_EN_NAME]: i18nHelper.getMessage('121208'),
  }
  

