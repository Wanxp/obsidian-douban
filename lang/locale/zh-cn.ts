//简体中文
export default {
    //main.ts
    'search douban by current file name':'用当前文档名搜索豆瓣并写入当前文档',
    'search douban and import to current file':'在豆瓣搜索并写入到当前文档',
    'Enter Search Term:':`输入搜索内容:`,
    'Search':`搜索`,
    'Cancel':`取消`,

    //DoubanSettingTab
    'douban search url': `豆瓣搜索地址`,
    'douban search url desc 1':  `豆瓣搜索页面请求地址, 通常是网页搜索的地址. `,
    'douban search url desc 2': `先访问:`,
    'douban search url desc 3': `然后在搜索输入框不输入任何内容,直接点击搜索,`,
    'douban search url desc 4': `所跳转的网页地址即是搜索地址,`,
    'douban search url desc 5': `将网页地址复制到当前输入框即可,`,

    'movie content template': `电影文本模板`,
    'movie content template desc 1':  `设置选择电影后导入的文本内容模板,`,
    'movie content template desc 2': `支持以下参数名称 :`,
    'movie content template desc 3': `{{id}},  {{type}},  {{title}}, {{originalTitle}},`,
    'movie content template desc 4': `{{score}}, {{datePublished}}, {{director}},`,
    'movie content template desc 5': `{{author}}, {{actor}}, {{desc}}, {{genre}},`,
    'movie content template desc 6': `{{image}}, {{url}}`,

    'book content template': `书籍文本模板`,
    'book content template desc 1':  `设置选择书籍后导入的文本内容模板,`,
    'book content template desc 2': `支持以下参数名称 :`,
    'book content template desc 3': `{{id}}, {{title}}, {{originalTitle}}, {{subTitle}},`,
    'book content template desc 4': `{{score}}, {{author}}, {{datePublished}}, {{type}},`,
    'book content template desc 5': `{{publish}}, {{desc}}, {{translator}}, {{isbn}},`,
    'book content template desc 6': `{{image}}, {{url}}, {{price}}, {{desc}}, {{totalPage}}`,

    'music content template': `音乐文本模板`,
    'music content template desc 1':  `设置选择音乐后导入的文本内容模板,`,
    'music content template desc 2': `支持以下参数名称 :`,
    'music content template desc 3': `{{id}}, {{title}}, {{actor}}, {{genre}},`,
    'music content template desc 4': `{{score}}, {{medium}}, {{datePublished}}, {{type}},`,
    'music content template desc 5': `{{publish}}, {{desc}}, {{albumType}}, {{barcode}},`,
    'music content template desc 6': `{{image}}, {{url}}, {{numberOfRecords}}, {{desc}}`,


    'Date format': `参数日期格式`,
    'This format will be used when available template variables contain date.':
    `这个格式是给上面获取到的参数进行格式化时显示的内容 .`,
    'For more syntax, refer to': `详细介绍请参考`,
    'Your current syntax looks like this':`时间参数时间格式预览`,
    'format reference': `格式参考`,
    'Array Spilt String':`数组分割字符串`,
    'string to join between array type, such as author, actor':`当模板中的变量存在数组, 则需要设定数组元素中的分割符号,比如 演员列表等`,
    'Douban Request Headers':`豆瓣HTTP请求头`,
    'Douban Request Headers Desc': `如果豆瓣搜索或者获取数据失败,请尝试修改这个参数,\n
     参数获取方式为:\n
     1. 访问http://www.douban.com
     2. 复制请求头,仅复制以下请求头 `,
     'current version not support type': `暂时不支持该类型导入,请至github提交issuess获取帮助`,
     'Douban': `豆瓣网`,

     'Person Name Language Mode':'人名显示模式',
     'options:':"可选项:",
     'Chinese Name mode, only show Chinese name':'中文名称模式, 人名只显示中文名',
     'English Name mode, only show English name':'英文名称模式, 人名只显示英文名',
     'Chinese English Name mode, show Chinese English name both':'中文和英文名称模式, 人名同时显示中文和英文名',
     'Chinese Name': '中文名',
     'English Name': '英文名',
     'Chinese And English Name': '中文名和英文名',

}