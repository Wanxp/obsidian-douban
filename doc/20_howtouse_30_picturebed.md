---
title: 图床
nav_order: 380
parent: 如何使用
---

# 图床
## PicGo
### 设置步骤
1. 安装并下载PicGo图床软件
2. 设置PicGo图床
3. （由于Obsidian-Douban是通过剪贴板上传图片的）需要在PicGo设置中开启剪贴板上传
4. 需要设置Server，开启并设置 端口36677
5. 设置完成之后，可以尝试点击PicGo主界面的`剪贴板上传`按钮，验证是否可以上传图片
6. 若在Obsidian-Douban设置中使用PicGo上传图片至图床，则每次导入书影音数据前，需要保证提前打开了PicGo软件
### 注意事项
Obsidian-Douban插件使用PicGo上传图片至图床仅在Linux系统下测试通过，其他系统未测试，其它系统有问题欢迎及时反馈
#### Linux
1. x11图形界面下，还需要安装xclip软件，否则无法使用剪贴板上传图片
2. wayland图形界面下, 还需要安装wl-clipboard软件，否则无法使用剪贴板上传图片
3. 若无法上传图片，可尝试开启PicGo软件设置中的`使用内置剪贴板上传`选项
