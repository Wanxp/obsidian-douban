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
dataTime: {{currentDate}} {{currentTime}}
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
isbn: {{isbn}}
url: {{url}}
totalPage: {{totalPage}}
price: {{price}}
tags: Book
binding: {{binding}}
dataTime: {{currentDate}} {{currentTime}}
desc: {{desc}}
---

![image|150]({{image}})

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
dataTime: {{currentDate}} {{currentTime}}
desc: {{desc}}
---

![image|150]({{image}})
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
dataTime: {{currentDate}} {{currentTime}}
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
dataTime: {{currentDate}} {{currentTime}}
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
dataTime: {{currentDate}} {{currentTime}}
desc: {{desc}}
---

![image]({{image}})
`,
}
