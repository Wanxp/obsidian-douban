import {TemplateKey} from "./Constsant";

export const DEFAULT_TEMPLATE_CONTENT = {
	movieTemplateFileContent: `---
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
aliases: {{aliases}}
country: {{country}}
language: {{language}}
IMDb: {{IMDb}}
time: {{time}}
createTime: {{currentDate}} {{currentTime}}
desc: {{desc}}
---

![image]({{image}})
`,
	bookTemplateFileContent: `---
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
producer: {{producer}}
isbn: {{isbn}}
url: {{url}}
totalPage: {{totalPage}}
price: {{price}}
tags: Book
binding: {{binding}}
createTime: {{currentDate}} {{currentTime}}
desc: {{desc}}
---

![image]({{image}})

{{menu}}
`,
	musicTemplateFileContent: `---
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
records: {{records}}
tags: Music
createTime: {{currentDate}} {{currentTime}}
desc: {{desc}}
---

![image]({{image}})
`,
	noteTemplateFileContent: `---
doubanId: {{id}}
title: {{title}}
type: {{type}}  
author: {{author}}
authorUrl: {{authorUrl}}
dateTimePublished: {{datePublished}} {{timePublished}}
url: {{url}}
tags: Article
createTime: {{currentDate}} {{currentTime}}
desc: {{desc}}
---

{{content}}
`,
	gameTemplateFileContent: `---
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
createTime: {{currentDate}} {{currentTime}}
desc: {{desc}}
---

![image]({{image}})	
`,teleplayTemplateFileContent: `---
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
aliases: {{aliases}}
country: {{country}}
language: {{language}}
IMDb: {{IMDb}}
time: {{time}}
episode: {{episode}}
createTime: {{currentDate}} {{currentTime}}
desc: {{desc}}
---

![image]({{image}})
`,
}

export const DEFAULT_TEMPLATE_CONTENT_WITH_STATE = {
	movieTemplateFileContent: `---
doubanId: {{id}}
title: {{title}}
type: {{type}}
score: {{score}}
myRating: {{myRating}}
originalTitle: {{originalTitle}}
genre: {{genre}}
datePublished: {{datePublished}}
director: {{director}}
actor: {{actor}}
author: {{author}}
tags: {{type}}, {{myTags}}
state: {{myState}}
url: {{url}}
aliases: {{aliases}}
country: {{country}}
language: {{language}}
IMDb: {{IMDb}}
time: {{time}}
createTime: {{currentDate}} {{currentTime}}
collectionDate: {{myCollectionDate}}
desc: {{desc}}
---

![image]({{image}})

Comment: 
---
{{myComment}}
`,
	bookTemplateFileContent: `---
doubanId: {{id}}
title: {{title}}
subTitle: {{subTitle}}
originalTitle: {{originalTitle}}
series: {{series}}
type: {{type}}
author: {{author}}
score: {{score}}
myRating: {{myRating}}
datePublished: {{datePublished}}
translator: {{translator}}
publisher: {{publisher}}
producer: {{producer}}
isbn: {{isbn}}
url: {{url}}
totalPage: {{totalPage}}
price: {{price}}
tags: Book, {{myTags}}
state: {{myState}}
binding: {{binding}}
createTime: {{currentDate}} {{currentTime}}
collectionDate: {{myCollectionDate}}
desc: {{desc}}
---

![image]({{image}})

Comment: 
---
{{myComment}}

{{menu}}
`,
	musicTemplateFileContent: `---
doubanId: {{id}}
title: {{title}}
type: {{type}}
actor: {{actor}}
score: {{score}}
myRating: {{myRating}}
genre: {{genre}}
medium: {{medium}}
albumType: {{albumType}}
datePublished: {{datePublished}}
publisher: {{publisher}}
barcode: {{barcode}}
url: {{url}}
records: {{records}}
tags: Music, {{myTags}}
state: {{myState}}
createTime: {{currentDate}} {{currentTime}}
collectionDate: {{myCollectionDate}}
desc: {{desc}}
---

![image]({{image}})

Comment: 
---
{{myComment}}

`,
	noteTemplateFileContent: `---
doubanId: {{id}}
title: {{title}}
type: {{type}}  
author: {{author}}
authorUrl: {{authorUrl}}
dateTimePublished: {{datePublished}} {{timePublished}}
url: {{url}}
tags: Article
createTime: {{currentDate}} {{currentTime}}
desc: {{desc}}
---

{{content}}
`,
	gameTemplateFileContent: `---
doubanId: {{id}}
title: {{title}}
aliases: {{aliases}}
type: {{type}}  
score: {{score}}
myRating: {{myRating}}
dateTimePublished: {{datePublished}}
publisher: {{publisher}}
genre: {{genre}}
developer: {{developer}}
platform: {{platform}}
url: {{url}}
tags: Game, {{myTags}}
state: {{myState}}
createTime: {{currentDate}} {{currentTime}}
collectionDate: {{myCollectionDate}}
desc: {{desc}}
---

![image]({{image}})	

Comment: 
---
{{myComment}}
`,teleplayTemplateFileContent: `---
doubanId: {{id}}
title: {{title}}
type: {{type}}
score: {{score}}
myRating: {{myRating}}
originalTitle: {{originalTitle}}
genre: {{genre}}
datePublished: {{datePublished}}
director: {{director}}
actor: {{actor}}
author: {{author}}
tags: {{type}}, {{myTags}}
state: {{myState}}
url: {{url}}
aliases: {{aliases}}
country: {{country}}
language: {{language}}
IMDb: {{IMDb}}
time: {{time}}
episode: {{episode}}
createTime: {{currentDate}} {{currentTime}}
collectionDate: {{myCollectionDate}}
desc: {{desc}}
---

![image]({{image}})

Comment: 
---
{{myComment}}
`,
}

/**
 * 获取默认的文档内容
 * @param key
 */
export function getDefaultTemplateContent(key: TemplateKey, useStateTemplate: boolean = true): string {
	// @ts-ignore
	return useStateTemplate ? DEFAULT_TEMPLATE_CONTENT_WITH_STATE[key + "Content"] : DEFAULT_TEMPLATE_CONTENT[key + "Content"];
}
