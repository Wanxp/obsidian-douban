//简体中文
export default {
	//main.ts
	'110001': 'search douban by current file name',
	'110002': 'search douban and import to current file',
	'110003': `Enter Search Term:`,
	'110004': `Search`,
	'110005': `Cancel`,
	'110006': `sync douban personal book-movie-music to Obsidian`,
	'110101': 'search douban and create file',
	'110201': `{0} already exists`,
	'110202': `{0} template can not read`,
	'110103': 'sync personal data from douban',
	'110007': `Start Sync`,
	'110009': `Stop Sync`,
	'110010': `Background`,
	'110008': `Exists Sync: {0}-{1}`,
	'110030': `Type:`,
	'110031': `CoverExists:`,
	'110032': `Scope:`,
	'110033': `Progress:`,
	'110034': `OutputFolder:`,
	'110035': `FileName: (Tip:Support Variables And Path)`,
	'110036': `Complete`,
	'110037': `
### Summary
{0}

### Details
{1}

---
PS: This file could be delete if you want to.
`,
	'110038': `DoubanSyncResult`,
	'110039': `SyncNotSync:`,
	'110040': `Only sync that haven't been synced yet. if not enabled, will sync all the subject'`,
	'110041': `IncrementalSync`,
	'110042': `EstimateTime`,
	'110043': `Loading Menu`,

	'110050': `Type`,
	'110051': `Number`,
	'110052': `Description`,

	'exists':`[exists]`,
	'unHandle':`[unHandle]`,
	'replace':`[replace]`,
	'create':`[create]`,
	'fail':`[fail]`,
	'syncall':`[summary]`,
	'notsync':`[notsync]`,

	'unHandle_desc':`unHandle`,
	'exists_desc':  `exists`,
	'replace_desc': `replace`,
	'create_desc':  `create`,
	'fail_desc':	`fail`,
	'notsync_desc': `notsync`,
	'syncall_desc': `syncall`,

	'110053':`|{0}|{1}|{2}|`,

	//DoubanSettingTab
	'1201': `Obsidian Douban`,
	'120001': `Douban Search Url`,
	'120002': `Douban search page request address. `,
	'120003': `First go to:`,
	'120004': `Don't enter anything in the search input box, just click Search,`,
	'120005': `The redirected web page address is the search address,`,
	'120006': `Just copy the web address to the current input box.`,

	'100101': `Login Douban`,
	'100111': `Douban login info Expired, please login again`,
	'100113': `Could not replace user info, please login again`,
	'100120': `Login Success`,
	'100121': `Please login`,
	'100122': `Nickname`,
	'100123': `DoubanID`,
	'100124': `Nickname`,
	'100125': `You can use your rating and reading status after logging in, see the last for specific variables.`,
	'100102': `Douban Human`,
	'100103': `Douban: Please search and import again `,


	'100126': `User Info`,
	'100128': `Logout`,
	'100129': `You have not login Douban, please login in computer first! After login, you can use your rating and reading status, see the last for specific variables.`,
	'100130': `Login`,
	'100131': `Login Douban`,
	'100132': `Load Douban Login Page Failed`,


	'1210': `Basic Setting`,
	'1203': `Template Setting`,
	'1220': `Output Setting`,
	'1230': `Usable Variables`,
	'1204': `Set template file path. If keep empty, it will use the default template file to create file. All the usable variables at the end.👇`,
	'1205': `🧡Tip: You can click the 'Copy' button to copy default template content, then create and paste to your own template file. After that, back to select the file. `,
	'1250': `Advanced Setting`,
	'1252': `Some Debug or Other Settings`,
	'1251': `☢The Advanced Setting only could be changed after you know what you are doing`,

	'1240': `Custom Variable`,
	'1241': `To use the custom variables, you need to wrap them in double curly brackets. For example, {{myType}} will be replaced with the your custom type value. `,
	'1242': `Add custom variable, so that you can use it in the template file or file name. `,
	'124101': `Add`,
	'124108': `Add a new variable`,
	'124102': `Name:`,
	'124103': `Input custom variable name`,
	'124104': `Value:`,
	'124105': `Input custom variable value`,
	'124106': `Active type`,
	'124107': `Delete custom variable`,

	'121101': `Template File`,
	'121102': `This template will be used when creating new notes. If keep empty, it will use default template`,

	'120101': `Movie Template File`,
	'120102': `This template will be used when creating new notes for Movie from Obsidian-Douban.`,
	'120103': `Available template variables are :`,
	'120104': `{{id}}, {{title}}, {{type}}, {{score}}, {{image}},`,
	'120105': `{{url}}, {{desc}}, {{datePublished}}, {{genre}}, `,
	'120106': `{{originalTitle}},{{director}}, {{author}},`,
	'120107': ` {{actor}}`,
	'120110': `Movie Template File`,



	'120201': `Book Template File`,
	'120202': `This template will be used when creating new notes for Movie from Obsidian-Douban. `,
	'120203': `Available Book template variables are :`,
	'120204': `{{id}}, {{title}}, {{type}}, {{score}}, {{image}},`,
	'120205': `{{url}}, {{desc}}, {{datePublished}}, {{publisher}}`,
	'120206': `{{originalTitle}}, {{subTitle}}, {{author}},`,
	'120207': `{{translator}}, {{isbn}}, {{price}}, {{totalPage}}`,
	'120208': `{{series}}, {{binding}}, {{menu}}`,

	'120301': `Music Template File`,
	'120302': `This template will be used when creating new notes for Music from Obsidian-Douban.`,
	'120303': `Available Music template variables are :`,
	'120304': `{{id}}, {{title}}, {{type}}, {{score}}, {{image}},`,
	'120305': `{{url}}, {{desc}}, {{datePublished}}, {{genre}},`,
	'120306': `{{actor}}, {{medium}}, {{albumType}},`,
	'120307': `{{barcode}}, {{records}}`,

	'120401': `Article Template File`,
	'120402': `This template will be used when creating new notes for Article from Obsidian-Douban.`,
	'120403': `Available Article template variables are :`,
	'120404': `{{id}}, {{title}}, {{type}}, {{image}},`,
	'120405': `{{url}}, {{desc}}, {{datePublished}}`,
	'120406': `{{author}}, {{authorUrl}}, {{content}}`,
	'120407': `{{timePublished}}`,

	'121301': `Game Template File`,
	'121302': `This template will be used when creating new notes for Game from Obsidian-Douban.`,
	'121303': `Available Game template variables are :`,
	'121304': `{{id}}, {{title}}, {{type}}, {{score}}, {{image}},`,
	'121305': `{{url}}, {{desc}}, {{publisher}}, {{datePublished}}`,
	'121306': `{{genre}}, {{aliases}}, {{developer}}, {{platform}}`,

	'121801': `Teleplay Template File`,
	'121802': `This template will be used when creating new notes for Teleplay from Obsidian-Douban.`,

	'120501': `Date Format`,
	'120502': `Time Format`,
	'120503': `This format will be used when available template variables contain date.`,
	'120504': `This format will be used when available template variables contain time.`,

	'120506': `For more syntax, refer to`,
	'120507': `Your current syntax looks like this`,
	'120508': `format reference`,
	'120601': `Array Spilt String`,
	'120602': `string to join between array type, such as authors, actors. 
    example: ','
    the list of actor's name will be shown as: 'actor1,actor2,actor3'`,
	'120701': `Douban Request Headers`,
	'120801': `This type of import is not supported temporarily, please go to github to submit issues for help`,
	'120901': `Douban`,
	'121201': `Person Name Language Mode`,
	'121202': `options:`,
	'121203': `Chinese Name mode, person name only show Chinese name`,
	'121204': `English Name mode, person name only show English name`,
	'121205': `Chinese English Name mode, show Chinese and English name both`,
	'121206': `Chinese Name`,
	'121207': `English Name`,
	'121208': `Chinese And English Name`,

	'121401': `Status Bar`,
	'121402': `Display status bar when import data ?`,

	'121430': `Save Attachment File`,
	'121431': `Save attachment file to local disk, such as image ?`,
	'121432': `Attachment folder`,
	'121433': `Attachment file created from Obsidian-Douban will be placed in this folder, If blank, they will be placed in the default location for this vault.`,
	'121434': `assets`,
	'121435': `Save High Definition Cover`,
	'121436': `High Definition Cover looks better but it will take more space, and you must login douban in this plugin`,
	'121437': `Please login first, Then this function could be enable`,
	'121438': `High Definition Cover looks better but it will take more space`,


	'121501': `Note folder`,
	'121502': `Nodes created from Obsidian-Douban will be placed in this folder, If blank, they will be placed in the default location for this vault. `,
	'121503': `Default Folder`,

	'121601': `Note Name`,
	'121602': `Nodes created from Obsidian-Douban will use this fileName as template(also support filePath),
	 If blank, they will be created by default name. support all basic template variables. example: {{type}}/{{title}}`,
	'121603': `assets`,

	'121701': `Search Template File`,
	// '121702': `Movie created from Obsidian-Douban will be placed in this folder, If blank, they will be placed in the default location for this vault. `,
	'121703': `Default`,

	'121901': `Copy default template content to clipboard`,
	'121902': `Reset to default value`,
	'121905': `Reset Advanced Settings to default value`,

	'121903': `Copy default template content (that your state in object) to clipboard`,


	'125001': `Debug Mode`,
	'125002': `Open Debug Mode, so that this plugin will log some message in console`,


	//error
	'130101': `Fetch Data Error, {0}`,
	'140101': `Not support for current type. You can add Issues at Github:Wanxp/obsidian-douban`,
	'130105': `Can not use Douban this time, Please try again after 12 hour or 24 hour. Or you can reset your connection `,
	'130106': `Can not use Douban this time, Please try Login In Douban Plugin. If not working please again after 12 hour or 24 hour. Or you can reset your connection `,



	'140201': `[OB-Douban]: searching '{0}'...`,
	'140202': `[OB-Douban]: result {0} rows`,
	'140203': `[OB-Douban]: request '{0}'`,
	'140204': `[OB-Douban]: replace '{0}'`,
	'140205': `[OB-Douban]: complete '{0}'`,
	'140206': `[OB-Douban]: occur error '{0}'`,
	'140207': `[OB-Douban]: [{0}/{1}] {2}`,
	'140208': `[OB-Douban]: [{0}/{1}] {2}`,

	'140301': `Douban: Syncing[{0}]...`,
	'140303': `Douban: User Info Expire, Please login again`,
	'140302': `Douban: Sync complete`,

	'150101': `Choose an item...`,





	//content
	'200101': `. `,

	'210101': `Default`,
	'210201': `Search...`,

	'122001': `Basic Variables`,
	'122002': `Extra Variables`,
	'122003': `Basic Variables must has value, Extra Variables can be empty`,
	'122004': `To use the template variables, you need to wrap them in double curly brackets. For example, {{title}} will be replaced with the title of the note.`,
	'122010': `My State Variables`,





	'410101': `Unknown`,

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
	'310105': `封面URL`,
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
	'310119': `-`,
	'310120': `-`,
	//电影
	'310201': `豆瓣ID`,
	'310202': `电影名称`,
	'310203': `类型`,
	'310204': `评分`,
	'310205': `封面`,
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


	//电视剧
	'310301': `豆瓣ID`,
	'310302': `电视剧名称`,
	'310303': `类型`,
	'310304': `评分`,
	'310305': `封面`,
	'310306': `豆瓣网址`,
	'310307': `简介`,
	'310308': `(未知)`,
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



	//音乐
	'310401': `豆瓣ID`,
	'310402': `音乐名`,
	'310403': `类型`,
	'310404': `评分`,
	'310405': `封面`,
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
	'310419': `-`,
	'310420': `-`,
	//日记
	'310501': `豆瓣ID`,
	'310502': `日记标题`,
	'310503': `类型`,
	'310504': `评分`,
	'310505': `图片`,
	'310506': `豆瓣网址`,
	'310507': `简介`,
	'310508': `发布者`,
	'310509': `发布时间`,
	'310510': `(其它)`,
	'310511': `author:作者`,
	'310512': `(其它)`,
	'310513': `authorUrl:作者网址`,
	'310514': `content:日记内容`,
	'310515': `-`,
	'310516': `-`,
	'310517': `-`,
	'310518': `-`,
	'310519': `-`,
	'310520': `-`,
	//游戏
	'310601': `豆瓣ID`,
	'310602': `游戏名称`,
	'310603': `类型`,
	'310604': `评分`,
	'310605': `封面`,
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
	'310619': `-`,
	'310620': `-`,
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
	'310719': `-`,
	'310720': `-`,


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
	'320112': `扩展12`,
	'320113': `扩展13`,

	'330101': `今日日期`,
	'330102': `当前时间`,


	'500000': `UNKNOWN`,
	'500101': `not`,
	'500102': `wish`,
	'500103': `do`,
	'500104': `collect`,

	'500201': `not`,
	'500202': `wish`,
	'500203': `do`,
	'500204': `collect`,

	'500301': `not`,
	'500302': `wish`,
	'500303': `do`,
	'500304': `collect`,

	'500401': `not`,
	'500402': `wish`,
	'500403': `do`,
	'500404': `collect`,

	'500501': `not`,
	'500502': `wish`,
	'500503': `do`,
	'500504': `collect`,

	'500601': `not`,
	'500602': `wish`,
	'500603': `do`,
	'500604': `collect`,

	'500701': `not`,
	'500702': `wish`,
	'500703': `do`,
	'500704': `collect`,

	'500004': `ALL`,


	'160225': `You can use those variables in your template after login. `,
	'160226': `The tags that I tag for subject`,
	'160227': `The rate that I rate to subject. (1-5)`,
	'160228': `My state at book-reading/video-watching.`,
	'160229': `Comment`,
	'160230': `Rate Date`,


	'500001': `Sync Config`,
	'504102': `My Book`,
	'504103': `My Movie`,
	'504104': `My Broadcast`,
	'504105': `My Note`,
	'504106': `My Music`,

	'500002': `Sync Status`,



	'500110': `Replace exists or not`,


	'ALL': `all`,
	'MOVIE': `movie`,
	'BOOK': `book`,
	'MUSIC': `music`,
	'NOTE': `note`,
	'GAME': `game`,
	'TELEPLAY': `teleplay`,

	'DAY': `D`,
	'HOUR': `H`,
	'MINUTE': `m`,
	'SECOND': `S`,
}
