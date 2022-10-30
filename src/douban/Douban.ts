import {PersonNameMode} from "../constant/Constsant";

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




export const doubanHeaders = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
};

export const DEFAULT_SETTINGS:DoubanPluginSettings = {
    movieTemplate: 
`---
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
tags: {{type}}
url: {{url}}
desc: {{desc}}
---

![image]({{image}})
`,
    bookTemplate: 
`---
doubanId: {{id}}
title: {{title}}
subTitle: {{subTitle}}
originalTitle: {{originalTitle}}
series: {{series}}
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
binding: {{binding}}
desc: {{desc}}
---

![image|150]({{image}})

{{menu}}
`,
    musicTemplate: 
`---
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
---

![image|150]({{image}})
`,
noteTemplate: 
`---
doubanId: {{id}}
title: {{title}}
type: {{type}}  
author: {{author}}
authorUrl: {{authorUrl}}
dateTimePublished: {{datePublished}} {{timePublished}}
url: {{url}}
tags: Article
desc: {{desc}}
---

{{content}}
`,
	gameTemplate:
`---
doubanId: {{id}}
title: {{title}}
aliases: {{aliases}}
type: {{type}}  
score: {{score}}
dateTimePublished: {{datePublished}}
publisher: {{publisher}}
genre: {{genre}}
developer: {{developer}}
platform: {{platform}}
url: {{url}}
tags: Game
desc: {{desc}}
---

![image]({{image}})	
`,
// totalWord: {{totalWord}}

    searchUrl: 'https://www.douban.com/search?q=',
    searchHeaders: JSON.stringify(doubanHeaders),
    dateFormat: "yyyy-MM-DD",
	timeFormat: "HH:mm:ss",
	arraySpilt: ", ",
    personNameMode: PersonNameMode.CH_NAME

}

