import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Obsidian Douban",
  description: "Plugin for obsidian to manage your douban data",
  themeConfig: {
    lang: 'zh-CN',
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    logo: '/obsidian-douban-logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '特殊效果', items: [
        { text: '时间线效果', link: '/Obsidian-Douban-TimeLine' },
        { text: '类网页效果', link: '/Obsidian-Douban-BlueTopaz' },
        { text: '书架效果', link: 'Obsidian-Douban-DataView-Jump' }
        ] },
      { text: '作者', link: 'https://wxp.hk' },
    ],

    sidebar: [
      {
        text: '如何安装', link: '/10_install'
      },
      { text: '使用说明', link: '/20_howtouse_10_detail' },
      { text: '登录方式', link: '/20_howtouse_25_setting_login_douban_cookie' },
      { text: '图床配置', link: '/20_howtouse_30_picturebed' },
      { text: '功能支持', link: '/30_function_10' },
      { text: '可用参数', link: '/30_function_20_support_variables' },
      { text: '时间线效果', link: '/Obsidian-Douban-TimeLine' },
      { text: '类网页效果', link: '/Obsidian-Douban-BlueTopaz' },
      { text: '书架效果', link: 'Obsidian-Douban-DataView-Jump' },
      { text: '数据影响', link: '/80_others_20_effect' },
      { text: '免责声明', link: '/80_others_disclaimer' },
      { text: '开发调试', link: '/70_develop' },
      { text: '反馈建议', link: '/97_issues' },
      { text: '支持作者', link: '/99_support' },


    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Wanxp/obsidian-douban' },
      // { icon: 'blog', link: 'https://github.com/Wanxp/obsidian-douban' }
    ],
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  }
})
