//简体中文

export default {
	//main.ts
	'110001': '用当前文档名搜索豆瓣并写入当前文档',
	'110002': '在豆瓣搜索并写入到当前文档',
	'110003': `输入搜索内容:`,
	'110004': `搜索`,
	'110005': `取消`,
	'110006': `同步豆瓣广播至Obsidian`,

	//DoubanSettingTab
	'1201': `Obsidian-豆瓣`,
	'120001': `豆瓣搜索地址`,
	'120002': `豆瓣搜索页面请求地址, 通常是网页搜索的地址. `,
	'120003': `先访问:`,
	'120004': `然后在搜索输入框不输入任何内容,直接点击搜索,`,
	'120005': `所跳转的网页地址即是搜索地址,`,
	'120006': `将网页地址复制到当前输入框即可,`,

	'120101': `电影文本模板`,
	'120102': `设置选择电影后导入的文本内容模板,`,
	'120103': `支持以下参数名称 :`,
	'120104': `{{id}}, {{title}}, {{type}}, {{score}}, {{image}},`,
	'120105': `{{url}}, {{desc}}, {{datePublished}}, {{genre}}, `,
	'120106': `{{originalTitle}},{{director}}, {{author}},`,
	'120107': ` {{actor}}`,

	'120201': `书籍文本模板`,
	'120202': `设置选择书籍后导入的文本内容模板,`,
	'120203': `支持以下参数名称 :`,
	'120204': `{{id}}, {{title}}, {{type}}, {{score}}, {{image}},`,
	'120205': `{{url}}, {{desc}}, {{datePublished}}, {{publisher}}`,
	'120206': `{{originalTitle}}, {{subTitle}}, {{author}},`,
	'120207': `{{translator}}, {{isbn}}, {{price}}, {{totalPage}}`,
	'120208': `{{series}}, {{binding}}, {{menu}}`,


	'120301': `音乐文本模板`,
	'120302': `设置选择音乐后导入的文本内容模板,`,
	'120303': `支持以下参数名称 :`,
	'120304': `{{id}}, {{title}}, {{type}}, {{image}},`,
	'120305': `{{url}}, {{desc}}, {{datePublished}}`,
	'120306': `{{genre}}, {{actor}}, {{medium}}, {{albumType}},`,
	'120307': `{{barcode}}, {{numberOfRecords}}`,

	'120401': `日记文本模板`,
	'120402': `设置选择日记后导入的文本内容模板,`,
	'120403': `支持以下参数名称 :`,
	'120404': `{{id}}, {{title}}, {{type}}, {{image}},`,
	'120405': `{{url}}, {{desc}}, {{datePublished}}`,
	'120406': `{{author}}, {{authorUrl}}, {{content}}`,
	'120407': `{{timePublished}}`,

	'121301': `游戏文本模板`,
	'121302': `设置选择游戏后导入的文本内容模板,`,
	'121303': `支持以下参数名称 :`,
	'121304': `{{id}}, {{title}}, {{type}}, {{score}}, {{image}},`,
	'121305': `{{url}}, {{desc}}, {{publisher}}, {{datePublished}}`,
	'121306': `{{genre}}, {{aliases}}, {{developer}}, {{platform}}`,


	'120501': `日期格式`,
	'120503': `这个格式是给上面获取到的参数进行格式化日期时显示的内容 .`,
	'120502': `时间格式`,
	'120504': `这个格式是给上面获取到的参数进行格式化时间时显示的内容 .`,
	'120506': `详细介绍请参考`,
	'120507': `时间参数时间格式预览`,
	'120508': `格式参考`,
	'120601': `数组分割字符串`,
	'120602': `当模板中的变量存在数组, 则需要设定数组元素中的分割符号,比如演员列表等.
    举例: ','	
    则演员表将会显示为: '演员1,演员2,演员3'`,
	'120701': `豆瓣HTTP请求头`,
	'120702': `如果豆瓣搜索或者获取数据失败,请尝试修改这个参数,\n
     参数获取方式为:\n
     1. 访问http://www.douban.com
     2. 复制请求头,仅复制以下请求头 `,
	'120801': `暂时不支持该类型导入,请至Github提交issuess获取帮助`,
	'120901': `豆瓣网`,

	'121201': `人名显示模式`,
	'121202': `可选项:`,
	'121203': `中文名称模式, 人名只显示中文名`,
	'121204': `英文名称模式, 人名只显示英文名`,
	'121205': `中文和英文名称模式, 人名同时显示中文和英文名`,
	'121206': `中文名`,
	'121207': `英文名`,
	'121208': `中文名和英文名`,

	'130101': `获取数据失败,您如有需要请至Github提交Issues`,
	'130102': `Obsidian Douban插件错误提示:`,
	'130103': `Obsidian Douban插件异常提示:`,
	'140101': `当前版本暂不支持该类型导入,请升级Obsidian Douban或至github提交issuess获取帮助`,

	'140201': `[Obsidian Douban]: 开始搜索'{0}'...`,
	'140202': `[Obsidian Douban]: 搜索条数{0}条`,
	'140203': `[Obsidian Douban]: 请求豆瓣'{0}'...`,
	'140204': `[Obsidian Douban]: 替换文本'{0}'...`,
	'140205': `[Obsidian Douban]: 处理完成'{0}'`,
	'140206': `[Obsidian Douban]: 出现错误'{0}'`,

	'150101': `选择一项内容...`,


	//content
	'200101': `。`,

//book example
	'book': {
		id: {desc: `豆瓣ID`, example: `25982198`},
		title: {desc: `书名`, example: `社会心理学（第11版，精装彩印）`},
		type: {desc: `类型`, example: `Book`},
		score: {desc: `评分`, example: `9.4`},
		image: {desc: `图片URL`, example: `https://img1.doubanio.com/view/subject/l/public/s28261247.jpg`},
		url: {desc: `豆瓣URL`, example: `https://book.douban.com/subject/25982198/`},
		desc: {
			desc: `简述`,
			example: `戴维·迈尔斯的《社会心理学》是美国700 多所大专院校社会心理学教学所采用的教材，自出版以来深受广大师生和社会心理学爱好者的喜爱，并被翻译成多种语言，有着广泛的影响力。本书译自第11 版。全书共分四...`
		},
		publisher: {desc: `出版社`, example: `人民邮电出版社`},
		datePublished: {desc: `出版时间`, example: `2014-10-1`},
		genre: {desc: `类型`, example: `社会科学`},
		author: {desc: `作者`, example: `戴维·迈尔斯`},
		translator: {desc: `译者`, example: `侯玉波 / 乐国安 / 张志勇`},
		isbn: {desc: `ISBN`, example: `9787115369840`},
		originTitle: {desc: `原作名`, example: `Social Psychology (11th)`},
		subTitle: {desc: `副标题`, example: `社会心理学`},
		binding: {desc: `装帧`, example: `精装`},
		totalPages: {desc: `页数`, example: `707`},
	}
}
