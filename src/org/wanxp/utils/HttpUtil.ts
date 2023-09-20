import axios from "axios";
import { log } from "./Logutil";
import { i18nHelper } from "../lang/helper";
import SettingsManager from "../douban/setting/SettingsManager";
import { request, RequestUrlParam } from "obsidian";
import DoubanHumanCheckModel from "../douban/component/DoubanHumanCheckModel";

import StringUtil from './StringUtil'
const https = require("https");

export default class HttpUtil {

  public static headers = StringUtil.parseHeaders(`
GET / HTTP/1.1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Accept-Language: zh-CN,zh;q=0.9
Cache-Control: max-age=0
Connection: keep-alive
Cookie: bid=7VX1Gyng3bk; ll="108296"; _pk_id.100001.8cb4=d613740a418b86c8.1695103115.; _pk_ses.100001.8cb4=1; __utma=30149280.540314287.1695103116.1695103116.1695103116.1; __utmc=30149280; __utmz=30149280.1695103116.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmt=1; __utmb=30149280.3.10.1695103116
Host: www.douban.com
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: none
Sec-Fetch-User: ?1
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
sec-ch-ua: "Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
`)

  /**
   * get请求
   * @param url 请求地址
   * @param headers 请求参数
   * @param settingsManager 设置管理器
   */
  // Cookie: 'll="108296"; bid=xHRJLeWBrjQ; _pk_id.100001.8cb4=f8f83e81ec224a1a.1691572669.; __utmv=30149280.13103; __yadk_uid=ce95W7OsgT0iKFceWgbMSUdw1oOqxNTk; __gads=ID=62585f60f3f637d0-2234f63fc6e200a5:T=1691572672:RT=1691572672:S=ALNI_MaIqTxSWHsfpnX9nAmMHcPQEsaezg; __gpi=UID=00000c29a9f98e5b:T=1691572672:RT=1691572672:S=ALNI_MbLAq8XNoKrRPKNqGCMdgXSPZvidw; ap_v=0,6.0; __utma=30149280.135860784.1691572641.1691572641.1694509646.2; __utmc=30149280; __utmz=30149280.1694509646.2.2.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1694509648%2C%22https%3A%2F%2Fmovie.douban.com%2Ftv%2F%22%5D; _pk_ses.100001.8cb4=1; __utmt=1; dbcl2="131038721:LUssju34QFw"; ck=dCQj; push_noty_num=0; push_doumail_num=0; __utmb=30149280.3.10.1694509646'
  public static httpRequestGet(url: string, headers: any, settingsManager?: SettingsManager): Promise<string> {
    let options = {
      headers: {
        ...this.headers,
        Cookie: headers.Cookie
      }
    }

    return new Promise((resolve, rejects) => {
      https.get(url, { ...options }, function (response: any) {
        let chunks: any = [],
          size = 0
        response.on("data", function (chunk: any) {
          chunks.push(chunk)
          size += chunk.length
        })

        response.on("end", function () {
          let data = Buffer.concat(chunks, size)
          let html = data.toString()
          console.log(html)
          resolve(html)
        })
      })
    })
  }

  /**
   * get请求
   * @param url 请求地址
   * @param headers 请求参数
   * @param settingsManager 设置管理器
   */
  public static httpRequestGet1(url: string, headers: any, settingsManager?: SettingsManager): Promise<string> {
    let requestUrlParam: RequestUrlParam = {
      url: url,
      method: "GET",
      headers: headers,
      throw: true
    };
    return request(requestUrlParam)
      // .then(res => res.text)
      .then(data => {
        if (data && data.indexOf('https://sec.douban.com/a') > 0) {
          log.notice(i18nHelper.getMessage('130105'))
          if (settingsManager) {
            settingsManager.debug(`Obsidian-Douban:获取异常网页如下:\n${data}`);
          }
        }
        settingsManager.debug(`Obsidian-Douban:获取网页如下:\n${data}`);
        return data;
      })
      .then(s => this.humanCheck(s, url, settingsManager))
      .catch(e => {
        if (e.toString().indexOf('403') > 0) {
          throw log.error(i18nHelper.getMessage('130105'), e)
        } else {
          throw log.error(i18nHelper.getMessage('130101').replace('{0}', e.toString()), e)
        }
      })


  }


  public static async humanCheck(html: any, url: string, settingsManager?: SettingsManager): Promise<any> {
    if (settingsManager) {
      settingsManager.debug(html);
    }
    if (html && html.indexOf("<title>禁止访问</title>") != -1) {
      const loginModel = new DoubanHumanCheckModel(url);
      await loginModel.load();
      return '';
    } else {
      return html;
    }



  }

  /**
   * get请求
   * @param url 		请求地址
   * @param settingsManager 设置管理器
   */
  public static httpRequestGetUrl(url: string, settingsManager?: SettingsManager): Promise<string> {
    return axios.get(url)
      .then(res => res.data)
      .then(data => {
        if (data && data.indexOf('https://sec.douban.com/a') > 0) {
          log.notice(i18nHelper.getMessage('130105'))
          if (settingsManager) {
            settingsManager.debug(`Obsidian-Douban:获取异常网页如下:\n${data}`);
          }
        }
        settingsManager.debug(`Obsidian-Douban:获取网页如下:\n${data}`);
        return data;
      })
      .catch(e => {
        if (e.toString().indexOf('403') > 0) {
          throw log.error(i18nHelper.getMessage('130105'), e)
        } else {
          throw log.error(i18nHelper.getMessage('130101').replace('{0}', e.toString()), e)
        }
      })
  }

}
