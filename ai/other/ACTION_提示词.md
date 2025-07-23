编写github action ，完成以下目标:
1. 当文件mainfest.json文件发生变更时才运行
2. 提供node18 环境
3. 执行npm install
4. 执行npm run build
5. 提取 package.json中的版本
6. 将当前master创建为版本的tag
7. 发布到github release 预发布版本，且版本的名称为当前版本
8. 发布的信息从commit中提取
9. 发布的内容为生成的main.js、mainfest.json、style.css 三个文件
10. 输出内容： 发布预发布版本{版本}正常