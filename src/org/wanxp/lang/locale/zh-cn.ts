//简体中文

import {SyncItemStatus} from "../../constant/Constsant";

export default {
	//main.ts
	'110001': '搜索当前文档名并写入',
	'110002': '搜索并写入当前文档',
	'110003': `输入搜索内容:`,
	'110004': `搜索`,
	'110005': `取消`,
	'110006': `同步广播至Obsidian`,
	'110101': '搜索并创建文档',
	'110103': '同步个人书影音广播记录',
	//'110102': 'search douban and create movie or tv',
	'110102': '搜索电影或电视剧并创建',
//	'110104': 'search douban and create book',
	'110104': '搜索书籍并创建',
	//'110105': 'search douban and create music',
	'110105': '搜索音乐并创建',
	//'110106': 'search douban and create game',
	'110106': '搜索游戏并创建',
	'110007': `开始同步`,
	'110009': `停止同步`,
	'110010': `后台运行`,
	'110008': `已经存在同步任务: {0}-{1}， 结束之后再重试`,
	'500002': `同步状态`,
	'110030': `选择类型:`,
	'110031': `替换同名文档:`,
	'110032': `选择状态:`,
	'110033': `进度:`,
	'110034': `输出文件夹:`,
	'110035': `文档名: (提示:支持参数化以及多级路径, 可用参数见配置界面)`,
	'110036': `完成`,
	'110152': `确认`,
	'110070': `同步范围:`,
	'110071': `全部`,
	'110072': `最新变动`,
	'110075': `最近30条`,
	'110074': `自定义时间`,
	'110076': `自定义条数`,
	'110077': `从`,
	'110078': `第`,
	'110079': `到`,
	'110073': `条`,
	'110095': `数字越小代表越接近现在，比如在豆瓣上我们最新更新一条内容为第一条，反之最早更新的就是最后一条了`,
	'110096': `这是我们在豆瓣上条目的更新时间`,

	'110080': `数字`,
	'112080': `自定义的数量输入不是个数字`,
	'110081': `开始时间和结束时间必须填写一个或都填写`,
	'110082': `时间录入格式必须是YYYY-MM-DD`,
	'110083': `不支持当前同步条件`,
	'110090': `[{0:未知}]状态为[{1:未知}]的总数为{2:未知},当前需要同步数为{3::未知}`,
	'110091': `异常:`,
	'110092': `情况:`,







	'110037': `
### 同步条件
{0}

### 同步结果汇总
{1}

### 同步结果明细
{2}

---
注:此文档可删除
`,
	'110038': `豆瓣同步结果`,
	'110039': `增量同步:`,
	'110040': `仅同步最近新增/同步失败/未同步的部分,增量适合之前同步中途失败停止或最近有豆瓣新增了内容,全量同步适合修改了模板或修改了存放路径情况下进行.`,
	'110041': `使用增量`,
	'110042': `预计处理时间`,
	'110043': `正在获取需要同步的列表, 请稍后`,
	'110044': `自定义条数的录入结束数量不能比开始数量小`,
	'110045': `自定义时间的录入结束时间不能比开始时间小`,


	'110050': `类型`,
	'110051': `数量`,
	'110052': `说明`,
	'110055': `开启`,
	'110056': `关闭`,

	'unHandle':`[已忽略]`,
	'exists':  `[未替换]`,
	'replace': `[已替换]`,
	'create':  `[已创建]`,
	'fail':	   `[已失败]`,
	'failByDiffType':	 `[类型不匹配]`,
	'syncall': `[总数]`,
	'notsync': `[未进行]`,

	'unHandle_desc':`增量同步上次已进行,这次无需处理`,
	'exists_desc':  `已经存在的同名文档,这次无需同步`,
	'replace_desc': `已经存在的同名文档,这次已被替换`,
	'create_desc':  `之前不存在的文档,这次直接新增`,
	'fail_desc':	`处理过程钟出现错误,未能成功`,
	'failByDiffType_desc':	`失败,类型不匹配,比如想要同步的是电影,但是实际获取到的是电视剧`,
	'notsync_desc': `因异常中断或提前终止导致还未处理`,
	'syncall_desc': `您此次同步条件在豆瓣中的条目总数`,

	'110201': `{0} 文件已经存在.`,
	'110202': `{0} 模板文件无法读取`,

	'100101': `登录豆瓣`,
	'100102': `豆瓣人机验证`,
	'100103': `人机认证通过，请重新搜索或导入`,
	'100111': `豆瓣登录信息过期,请至Douban插件重新登录`,
	'100113': `无法替换用户信息变量, 登录信息过期, 请重新登录Douban`,
	'100120': `已登录`,
	'100121': `请登录`,
	'100122': `昵称`,
	'100123': `豆瓣ID`,
	'100124': `昵称`,
	'100125': `登录后, 可使用你的评分/阅读状态等作为导入参数,具体可用参数见最后.`,


	'100126': `豆瓣用户信息`,
	'100128': `登出`,
	'100129': `豆瓣未登录，请先在电脑端登录！登录后导入参数可使用你的评分以及阅读状态等,具体可用参数见最后.`,
	'100130': `登录`,
	'100131': `登录豆瓣`,
	'100133': `登录出错处理`,
	'100135': `Cookie登录`,
	'100136': `Cookie输入`,
	'100137': `使用Cookie登录失败,请确认Cookie填写是否正确`,
	'100134': `如果上面登录按钮点击后在弹窗中登录还是没成功,请点击此[Cookie登录]按钮,然后按照`,
	'100139': `[教程]`,
	'100138': `获取Cookie,并将Cookie复制到下面输入框中,最后点击✔️`,
	'100132': `加载豆瓣登录页面失败`,

	//DoubanSettingTab
	'1201': `Obsidian-豆瓣`,
	'120001': `豆瓣搜索地址`,
	'120002': `豆瓣搜索页面请求地址, 通常是网页搜索的地址. `,
	'120003': `先访问:`,
	'120004': `然后在搜索输入框不输入任何内容,直接点击搜索,`,
	'120005': `所跳转的网页地址即是搜索地址,`,
	'120006': `将网页地址复制到当前输入框即可,`,

	'1210': `基础`,
	'1203': `模板`,
	'1220': `输出`,
	'1230': `字段`,
	'1260': `登录`,

	'1204': `配置对应类型的模板文件, 如果为空则使用默认模板. 模板可使用的参数在页签'字段'和'自定义字段'中查看`,
	'1205': `🧡提示: 建议点击右侧'复制'默认模板按钮, 然后在新建的文件中粘贴修改模板, 最后回到此处选择对应模板. `,
	'1240': `自定义字段`,
	'1241': `自定义参数，值本身也支持使用参数，如myTitle:《{{title}}》。在模板中使用参数时请用'{{}}'包裹, 举例: 参数myType, 则使用时为{{myType}}. `,
	'1242': `添加自定义参数, 参数可用于模板中或者文件名中. `,
	'1250': `高级`,
	'1252': `一些运行时的高级配置，如开启debug模式`,
	'1251': `☢高级设置只有当你知道修改此设置之后的影响才允许修改, 正常情况下请保持默认`,

	'125001': `调试模式`,
	'125002': `调试模式开启后，将会在控制台打印此插件的日志信息`,

	'125011': `重置设置为默认`,
	'125012': `将设置重置为默认值，但不会清除登录信息，也不会清除自定义参数`,

	'125021': `清除登录缓存`,
	'125022': `清除登录信息，如果你遇到登录问题，可以尝试清除登录缓存，点击按钮将清除所有登录缓存数据`,

	'125031': `清除同步缓存`,
	'125032': `清除同步缓存，点击按钮将清除所有同步缓存数据（但不会清除已同步的文档）`,

	'125033': `确认要执行此操作吗？`,

	"125034": `导出配置`,
	"125035": `导出当前插件的所有配置到一个本地文件中，包括所有设置、同步记录的缓存、登录状态`,
	"125047": `选择路径..`,
	"125036": `导入配置`,
	"125037": `导入一个之前导出的配置文件，将会覆盖当前所有设置、同步记录的缓存、登录状态。为了安全起见，建议先导出当前配置再尝试导入`,
	"125038": `导入配置文件`,
	"125039": `选择文件..`,
	"125040": `导入`,
	"125041": `导入配置成功`,
	"125042": `导入配置失败`,
	"125043": `导入配置文件失败，请检查文件是否正确`,
	"125044": `导入配置文件成功`,
	"125045": `导入配置文件成功，请重新加载页面`,
	"125046": `导入配置文件，注意先导出配置备份，然后才导入配置文件`,

	'124101': `新增`,
	'124108': `新增一个自定义参数`,
	'124102': `参数名称:`,
	'124103': `自定义参数名称`,
	'124104': `参数值:`,
	'124105': `自定义参值`,
	'124106': `生效类型`,
	'124107': `删除自定义参数`,

	'121101': `模板文件`,
	'121102': `如果为空, 笔记将会会使用默认模板`,

	'120101': `电影`,
	'120102': `导入电影所使用的模板, 请输入并选择对应的文件路径`,
	'120103': `支持以下参数名称 :`,
	'120104': `{{id}}, {{title}}, {{type}}, {{score}}, {{image}},`,
	'120105': `{{url}}, {{desc}}, {{datePublished}}, {{genre}}, `,
	'120106': `{{originalTitle}},{{director}}, {{author}},`,
	'120107': ` {{actor}}`,

	'120201': `书籍`,
	'120202': `导入书籍所使用的模板, 请输入并选择对应的文件路径`,
	'120203': `支持以下参数名称 :`,
	'120204': `{{id}}, {{title}}, {{type}}, {{score}}, {{image}},`,
	'120205': `{{url}}, {{desc}}, {{datePublished}}, {{publisher}}`,
	'120206': `{{originalTitle}}, {{subTitle}}, {{author}},`,
	'120207': `{{translator}}, {{isbn}}, {{price}}, {{totalPage}}`,
	'120208': `{{series}}, {{binding}}, {{menu}}`,

	'120301': `音乐`,
	'120302': `导入音乐所使用的模板, 请输入并选择对应的文件路径`,
	'120303': `支持以下参数名称 :`,
	'120304': `{{id}}, {{title}}, {{type}}, {{image}},`,
	'120305': `{{url}}, {{desc}}, {{datePublished}}`,
	'120306': `{{genre}}, {{actor}}, {{medium}}, {{albumType}},`,
	'120307': `{{barcode}}, {{records}}`,

	'120401': `日记`,
	'120402': `导入日记所使用的模板, 请输入并选择对应的文件路径`,
	'120403': `支持以下参数名称 :`,
	'120404': `{{id}}, {{title}}, {{type}}, {{image}},`,
	'120405': `{{url}}, {{desc}}, {{datePublished}}`,
	'120406': `{{author}}, {{authorUrl}}, {{content}}`,
	'120407': `{{timePublished}}`,

	'121301': `游戏`,
	'121302': `导入游戏所使用的模板, 请输入并选择对应的文件路径`,
	'121303': `支持以下参数名称 :`,
	'121304': `{{id}}, {{title}}, {{type}}, {{score}}, {{image}},`,
	'121305': `{{url}}, {{desc}}, {{publisher}}, {{datePublished}}`,
	'121306': `{{genre}}, {{aliases}}, {{developer}}, {{platform}}`,


	'121801': `电视剧`,
	'121802': `导入电视剧所使用的模板, 请输入并选择对应的文件路径`,


	'120501': `日期格式`,
	'120503': `这个格式是给下面获取到的参数进行格式化日期时显示的内容 .`,
	'120502': `时间格式`,
	'120504': `这个格式是给下面获取到的参数进行格式化时间时显示的内容 .`,
	'120506': `详细介绍请参考`,
	'120507': `时间参数时间格式预览`,
	'120508': `格式参考`,
	'120601': `数组显示`,
	'120602': `当模板中的变量存在数组, 则需要设定数组元素中的分割符号以及起始与结束符号, 比如演员列表,
	支持转义字符\\n(回车)。并且同时支持多种方式输出内容，点击[+]新增不同输出形式，预览效果在下方`,
	'124109': `首:`,
	'124110': `元素首:`,
	'124111': `分隔符:`,
	'124112': `元素尾:`,
	'124113': `尾:`,

	'1243': `评分scoreStar/myRateStar显示`,
	'124120': `得分符号:`,
	'124121': `未得分符号:`,
	'124122': `显示未得分:`,
	'124310': `评分（星）参数{{scoreStar}} and {{myRatingStar}}输出格式。当分数是{0}/{1}时，模板案例\`score: {{scoreStar}}\``,
	'124311': `最大符号数:`,
	'124312': `默认整数:`,

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

	'121401': `状态栏`,
	'121402': `当在导入数据时, 是否需要在状态栏显示处理状态? `,

	//	'121410': `Search Default Type`,
	// 	'121411': `Search defuault type for open command palette 'search douban and create file'`,
	'121410': `默认搜索类型`,
	'121411': `在打开"搜索豆瓣并创建文件"时默认搜索的类型`,




	'121430': `保存图片附件`,
	'121431': `导入数据会同步保存图片附件到本地文件夹, 如电影封面,书籍封面。如果需要显示封面，请保持开启该功能。`,
	'121432': `附件存放位置`,
	'121433': `保存的附件将会存放至该文件夹中. 如果为空, 笔记将会存放到默认位置(assets), 且支持所有'通用'的参数。如：{{myType}}/attachments`,
	'121434': `assets`,
	'121435': `保存高清封面`,
	'121436': `高清封面图片质量更高清晰度更好, 需要您在此插件 登录豆瓣 才能生效, 若未登录则默认使用低精度版本封面`,
	'121437': `登录后此功能才会生效`,
	'121438': `高清封面图片质量更高, 清晰度更好, 但占用空间会比普通清晰度封面更多`,
	'121440': `使用附件图床`,
	'121441': `开启此选项将会把导入的封面文件上传图床，而不是保存在本地`,
	'121450': `图床类型`,
	'121451': `选择图床类型`,
	'121461': `PicGo上传Url`,


	'121501': `笔记存放位置`,
	'121502': `创建的笔记将会存放至该文件夹中. 如果为空, 笔记将会存放到Obsidian的默认位置`,

	'121601': `笔记名称`,
	'121602': `创建的笔记将会使用此名称作为模板, 支持所有'通用'的参数作为名称(如:{{type}}/{{title}}), 且支持路径, 比如: 'MyData/{{title}}'. 如果为空, 笔记将会使用默认名称. `,
	'121604': `文件路径预览`,
	'120603': `输出效果预览`,
	'120604': `数组类型名称:`,
	'120605': `模板中使用举例： propertyName:{{actor`,
	'120606': `删除列表类型字段显示方式`,
	'120607': `新增列表类型字段显示方式:`,
	'120608': `显示或隐藏列表输出设置`,



	'121701': `选择模板文件`,


	'121901': `复制基础模板内容`,
	'121903': `复制含有我的评分的模板内容. 模板中有登录后可以用的参数,如我的评分, 我的阅读状态等`,


	'130101': `获取数据失败,{0}`,
	'130102': `Obsidian Douban插件错误提示:`,
	'130103': `Obsidian Douban插件异常提示:`,
	'140101': `当前版本暂不支持该类型导入,请升级Obsidian Douban或至github提交issuess获取帮助`,
	'140102': `同步的对象和选择对象不一致，将不会同步, 现在选择同步的类型：{0}，但是获取[{1}]的类型：{2}`,
	'130105': `由于多次频繁请求数据，豆瓣当前暂时不可用. 请于12小时或24小时后再重试，或重置你的网络(如重新拨号或更换网络) `,
	'130106': `请尝试在Douban插件中登录后操作. 若还是无效果则尝试于12小时或24小时后再重试，或重置你的网络(如重新拨号或更换网络) `,
	'130107': `参数{0}中指定的数组输出类型{1}不存在，请前往配置进行设置`,
	'130120': `同步时发生错误，但同步将会继续。错误项目是 {}。`,
	'130121': `总数只有{0}, 选择的开始比总数还要大，将不会同步。`,

	'140201': `[OB-Douban]: 开始搜索'{0}'...`,
	'140202': `[OB-Douban]: 搜索条数{0}条`,
	'140203': `[OB-Douban]: 请求豆瓣'{0}'...`,
	'140204': `[OB-Douban]: 替换文本'{0}'...`,
	'140205': `[OB-Douban]: 处理完成'{0}'`,
	'140206': `[OB-Douban]: 出现错误,请尝试重新登录.错误原因:'{0}'`,
	'140207': `[OB-Douban]: [{0}/{1}] {2}`,
	'140208': `[OB-Douban]: [{0}/{1}] {2}`,


	'140301': `Douban: 开始同步[{0}]...`,
	'140302': `Douban: 同步完成`,
	'140303': `Douban: 用户信息已过期，请至插件中重新登录`,
	'140304': `Douban: 此功能需要登录, 请先至插件中登录豆瓣`,

	'150101': `选择一项内容...`,
	'121902': `重置为默认值`,
	'150106': `[上一页]...(默认查询结果)`,
	'150102': `[上一页]...`,
	'150103': `[下一页]...`,
	'150105': `[下一页]...(小组帖子结果)`,
	'150104': `[下一页]...(请先在插件中登录才能使用此功能)`,
//	'150107': `Result is empty. Please choose type before search`,
	'150107': `结果为空，请先选择类型再搜索`,
	'150108': `如果没有找到你想要的内容, 请尝试更换关键字或者更换搜索类型`,

	//content
	'200101': `。`,

//book example
// 	'book': {
// 		id: {desc: `豆瓣ID`, example: `25982198`},
// 		title: {desc: `书名`, example: `社会心理学（第11版，精装彩印）`},
// 		type: {desc: `类型`, example: `Book`},
// 		score: {desc: `评分`, example: `9.4`},
// 		image: {desc: `图片URL`, example: `https://img1.doubanio.com/view/subject/l/public/s28261247.jpg`},
// 		url: {desc: `豆瓣URL`, example: `https://book.douban.com/subject/25982198/`},
// 		desc: {
// 			desc: `简述`,
// 			example: `戴维·迈尔斯的《社会心理学》是美国700 多所大专院校社会心理学教学所采用的教材，自出版以来深受广大师生和社会心理学爱好者的喜爱，并被翻译成多种语言，有着广泛的影响力。本书译自第11 版。全书共分四...`
// 		},
// 		publisher: {desc: `出版社`, example: `人民邮电出版社`},
// 		datePublished: {desc: `出版时间`, example: `2014-10-1`},
// 		genre: {desc: `类型`, example: `社会科学`},
// 		author: {desc: `作者`, example: `戴维·迈尔斯`},
// 		translator: {desc: `译者`, example: `侯玉波 / 乐国安 / 张志勇`},
// 		isbn: {desc: `ISBN`, example: `9787115369840`},
// 		originTitle: {desc: `原作名`, example: `Social Psychology (11th)`},
// 		subTitle: {desc: `副标题`, example: `社会心理学`},
// 		binding: {desc: `装帧`, example: `精装`},
// 		totalPages: {desc: `页数`, example: `707`},
// 	},

	'122001': `通用参数`,
	'122002': `扩展参数`,
	'122003': `通用参数一定有值不为空, 扩展参数可能为空`,
	'122004': `以下参数使用时请用'{{}}'包裹, 举例: 参数title, 则使用时为{{title}}. `,
	'122010': `我的状态参数`,

	'410101': ``,
	'410102': `未知`,

	'410200': `评分⭐`,

	//参数
	'300101': `参数`,
	'300102': `书籍`,
	'300103': `电影`,
	'300104': `电视剧`,
	'300105': `音乐`,
	'300106': `日记`,
	'300107': `游戏`,
	'300108': `广播`,

	//书籍
	'310101': `豆瓣ID`,
	'310102': `书名`,
	'310103': `类型`,
	'310104': `评分`,
	'310105': `封面路径`,
	'310106': `豆瓣网址`,
	'310107': `内容简介`,
	'310108': `出版社`,
	'310109': `出版时间`,
	'310110': ``,
	'310111': `author:原作者`,
	'310112': `translator:译者`,
	'310113': `isbn:isbn`,
	'310114': `originalTitle:原作名`,
	'310115': `subTitle:副标题`,
	'310116': `totalPage:页数`,
	'310117': `binding:装帧`,
	'310118': `producer:出品方`,
	'310130': `出版年份`,
	'310121': `封面URL`,
	'310122': `menu:目录`,


	//电影
	'310201': `豆瓣ID`,
	'310202': `电影名称`,
	'310203': `类型`,
	'310204': `评分`,
	'310205': `封面路径`,
	'310206': `豆瓣网址`,
	'310207': `简介`,
	'310208': ``,
	'310209': `上映日期`,
	'310210': `类型`,
	'310211': `director:导演`,
	'310212': `author:编剧`,
	'310213': `actor:主演`,
	'310214': `originalTitle:原作名`,
	'310215': `country:国家`,
	'310216': `language:语言`,
	'310217': `time:片长`,
	'310218': `aliases:又名`,
	'310219': `IMDb`,
	'310220': `-`,
	'310230': `上映年份`,
	'310221': `封面URL`,
	'310222': `-`,

	//电视剧
	'310301': `豆瓣ID`,
	'310302': `电视剧名称`,
	'310303': `类型`,
	'310304': `评分`,
	'310305': `封面路径`,
	'310306': `豆瓣网址`,
	'310307': `简介`,
	'310308': `(固定值:未知)`,
	'310309': `上映日期`,
	'310310': `类型`,
	'310311': `director:导演`,
	'310312': `author:编剧`,
	'310313': `actor:主演`,
	'310314': `originalTitle:原作名`,
	'310315': `country:国家`,
	'310316': `language:语言`,
	'310317': `time:片长`,
	'310318': `aliases:又名`,
	'310319': `IMDb`,
	'310320': `episode:集数`,
	'310330': `上映年份`,
	'310321': `封面URL`,
	'310322': `-`,


	//音乐
	'310401': `豆瓣ID`,
	'310402': `音乐名`,
	'310403': `类型`,
	'310404': `评分`,
	'310405': `封面路径`,
	'310406': `豆瓣网址`,
	'310407': `简介`,
	'310408': `出版者`,
	'310409': `发行时间`,
	'310410': `流派`,
	'310411': `actor: 表演者`,
	'310412': `albumType:专辑类型`,
	'310413': `medium:介质`,
	'310414': `records:唱片数`,
	'310415': `barcode:条形码`,
	'310416': `-`,
	'310417': `-`,
	'310418': `-`,
	'310430': `发行年份`,
	'310421': `封面URL`,
	'310422': `menu:目录`,


	//日记
	'310501': `豆瓣ID`,
	'310502': `日记标题`,
	'310503': `类型`,
	'310504': `评分`,
	'310505': `封面路径`,
	'310506': `豆瓣网址`,
	'310507': `简介`,
	'310508': `发布者`,
	'310509': `发布时间`,
	'310510': ``,
	'310511': `author:作者`,
	'310512': `authorUrl:作者网址`,
	'310513': `content:日记内容`,
	'310514': `-`,
	'310515': `-`,
	'310516': `-`,
	'310517': `-`,
	'310518': `-`,
	'310530': `发布年份`,
	'310521': `封面URL`,
	'310522': `-`,

	//游戏
	'310601': `豆瓣ID`,
	'310602': `游戏名称`,
	'310603': `类型`,
	'310604': `评分`,
	'310605': `封面路径`,
	'310606': `豆瓣网址`,
	'310607': `简介`,
	'310608': `发行商`,
	'310609': `发行日期`,
	'310610': `类型`,
	'310611': `aliases:别名`,
	'310612': `developer:开发商`,
	'310613': `platform:平台`,
	'310614': `-`,
	'310615': `-`,
	'310616': `-`,
	'310617': `-`,
	'310618': `-`,
	'310630': `发行年份`,
	'310621': `封面URL`,
	'310622': `-`,


	//广播
	'310701': `待开发`,
	'310702': `待开发`,
	'310703': `待开发`,
	'310704': `待开发`,
	'310705': `待开发`,
	'310706': `待开发`,
	'310707': `待开发`,
	'310708': `待开发`,
	'310709': `待开发`,
	'310710': `待开发`,
	'310711': `-`,
	'310712': `-`,
	'310713': `-`,
	'310714': `-`,
	'310715': `-`,
	'310716': `-`,
	'310717': `-`,
	'310718': `-`,
	'310730': `-`,
	'310721': `-`,
	'310722': `-`,

	'320101': `扩展1`,
	'320102': `扩展2`,
	'320103': `扩展3`,
	'320104': `扩展4`,
	'320105': `扩展5`,
	'320106': `扩展6`,
	'320107': `扩展7`,
	'320108': `扩展8`,
	'320109': `扩展9`,
	'320110': `扩展10`,
	'320111': `扩展11`,



	'330101': `今日日期`,
	'330102': `当前时间`,


	'500000': `未知`,
	'500101': `未做`,
	'500102': `想做`,
	'500103': `正在做`,
	'500104': `做完`,

	'500201': `未看`,
	'500202': `想看`,
	'500203': `在看`,
	'500204': `看过`,

	'500301': `未看`,
	'500302': `想看`,
	'500303': `在看`,
	'500304': `看过`,

	'500401': `未听`,
	'500402': `想听`,
	'500403': `在听`,
	'500404': `听过`,

	'500501': `未看`,
	'500502': `想看`,
	'500503': `在看`,
	'500504': `看过`,

	'500601': `未玩`,
	'500602': `想玩`,
	'500603': `在玩`,
	'500604': `玩过`,

	'500701': `未看`,
	'500702': `想看`,
	'500703': `在看`,
	'500704': `看过`,

	'500004': `所有`,
	'500110': `开启后，同步时若遇到同路径下的同名文档则会覆盖`,



	'160225': `以下参数登录后方可在模板中使用, 使用时请用'{{}}'包裹, 举例: 参数myTags, 则使用时为{{myTags}}`,
	'160226': `我标记的标签`,
	'160227': `我的评分(1-5)`,
	'160231': `我的评分(⭐)`,

	'160228': `我的阅读/欣赏/听/玩的状态`,
	'160229': `我的评论`,
	'160230': `我的评论/标记的日期`,

	'500001': `同步设置`,
	'504102': `我的书籍`,
	'504103': `我的电影`,
	'504107': `我的电视剧`,
	'504104': `我的广播`,
	'504105': `我的日记`,
	'504106': `我的音乐`,
	'504108': `我的游戏`,


	'ALL': `全部类型`,
	'MOVIE': `电影`,
	'BOOK': `书籍`,
	'MUSIC': `音乐`,
	'NOTE': `笔记`,
	'GAME': `游戏`,
	'TELEPLAY': `电视剧`,
	'THEATER': `戏剧`,
	'MOVIE_AND_TELEPLAY': `影视剧`,


	'all': `全部类型`,
	'movie': `电影`,
	'book': `书籍`,
	'music': `音乐`,
	'note': `笔记`,
	'game': `游戏`,
	'teleplay': `电视剧`,
	'theater': `戏剧`,
	'movie_and_teleplay': `影视剧`,

	'DAY': `天`,
	'HOUR': `时`,
	'MINUTE': `分`,
	'SECOND': `秒`,

}
