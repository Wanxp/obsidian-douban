import { log } from "./Logutil";
import { i18nHelper } from "../lang/helper";
import SettingsManager from "../douban/setting/SettingsManager";
import { request, RequestUrlParam } from "obsidian";
import DoubanHumanCheckModel from "../douban/component/DoubanHumanCheckModel";
import {LoginUtil} from "./LoginUtil";

const get = require('simple-get')

export default class HttpUtil {



  /**
   * get请求
   * @param url 请求地址
   * @param headers 请求参数
   * @param settingsManager 设置管理器
   */
  // Cookie: 'll="108296"; bid=xHRJLeWBrjQ; _pk_id.100001.8cb4=f8f83e81ec224a1a.1691572669.; __utmv=30149280.13103; __yadk_uid=ce95W7OsgT0iKFceWgbMSUdw1oOqxNTk; __gads=ID=62585f60f3f637d0-2234f63fc6e200a5:T=1691572672:RT=1691572672:S=ALNI_MaIqTxSWHsfpnX9nAmMHcPQEsaezg; __gpi=UID=00000c29a9f98e5b:T=1691572672:RT=1691572672:S=ALNI_MbLAq8XNoKrRPKNqGCMdgXSPZvidw; ap_v=0,6.0; __utma=30149280.135860784.1691572641.1691572641.1694509646.2; __utmc=30149280; __utmz=30149280.1694509646.2.2.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1694509648%2C%22https%3A%2F%2Fmovie.douban.com%2Ftv%2F%22%5D; _pk_ses.100001.8cb4=1; __utmt=1; dbcl2="131038721:LUssju34QFw"; ck=dCQj; push_noty_num=0; push_doumail_num=0; __utmb=30149280.3.10.1694509646'
  public static httpRequestGet(url: string, headers: any, settingsManager?: SettingsManager): Promise<string> {
	  settingsManager.debug(`请求地址:${url}`);
	const {['Accept-Encoding']: acceptEncoding, ...headersInner} = headers;
    let options = {
      headers: headersInner
    }
	settingsManager.debug(`Obsidian-Douban:从网络获取网页开始:\nurl:${url}\nheaders:${JSON.stringify(headers)}`);
    return new Promise((resolve, rejects) => {
      get(url, { ...options }, function (err:any, response: any) {
        let chunks: any = [],
          size = 0;
		if (response.status == 403) {
			rejects(new Error(i18nHelper.getMessage('130106')));
		}
        response.on("data", function (chunk: any) {
          chunks.push(chunk)
          size += chunk.length
        })

        response.on("end", function () {
           const data = Buffer.concat(chunks, size)
			const html = data.toString()
			if (settingsManager) {
				settingsManager.debug(`Obsidian-Douban:从网络获取网页完成:\nhtml:\n${html}`);
			}
			if (LoginUtil.contentNeedLogin(html)) {
				rejects(new Error(i18nHelper.getMessage('140304')));
			}
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
	// Cookie: 'll="108296"; bid=xHRJLeWBrjQ; _pk_id.100001.8cb4=f8f83e81ec224a1a.1691572669.; __utmv=30149280.13103; __yadk_uid=ce95W7OsgT0iKFceWgbMSUdw1oOqxNTk; __gads=ID=62585f60f3f637d0-2234f63fc6e200a5:T=1691572672:RT=1691572672:S=ALNI_MaIqTxSWHsfpnX9nAmMHcPQEsaezg; __gpi=UID=00000c29a9f98e5b:T=1691572672:RT=1691572672:S=ALNI_MbLAq8XNoKrRPKNqGCMdgXSPZvidw; ap_v=0,6.0; __utma=30149280.135860784.1691572641.1691572641.1694509646.2; __utmc=30149280; __utmz=30149280.1694509646.2.2.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1694509648%2C%22https%3A%2F%2Fmovie.douban.com%2Ftv%2F%22%5D; _pk_ses.100001.8cb4=1; __utmt=1; dbcl2="131038721:LUssju34QFw"; ck=dCQj; push_noty_num=0; push_doumail_num=0; __utmb=30149280.3.10.1694509646'
	public static httpRequestGetJson(url: string, headers: any, settingsManager?: SettingsManager): Promise<any> {
		const {['Accept-Encoding']: acceptEncoding, ...headersInner} = headers;
		const options = {
			headers: headersInner
		}
		settingsManager.debug(`Obsidian-Douban:从网络获取json开始:\nurl:${url}\nheaders:${JSON.stringify(headers)}`);
		return new Promise((resolve, rejects) => {
			get(url, { ...options }, function (err:any, response: any) {
				const chunks: any = [];
				let	size = 0;
				if (response.status == 403) {
					rejects(new Error(i18nHelper.getMessage('130106')));
				}
				response.on("data", function (chunk: any) {
					chunks.push(chunk)
					size += chunk.length
				})

				response.on("end", function () {
					const data = Buffer.concat(chunks, size)
					const html = data.toString()
					if (settingsManager) {
						settingsManager.debug(`Obsidian-Douban:从网络获取网页完成:\nhtml:\n${html}`);
					}
					if (LoginUtil.contentNeedLogin(html)) {
						rejects(new Error(i18nHelper.getMessage('140304')));
					}
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
	public static httpRequestGetBuffer(url: string, headers: any, settingsManager?: SettingsManager): Promise<ArrayBuffer> {
		let options = {
			headers: headers
		}
		if (settingsManager) {
			settingsManager.debug(`Obsidian-Douban:从网络获取文件开始:\n${url}`);
		}
		return new Promise((resolve, rejects) => {
			get(url, { ...options }, function (err:any, response: any) {
				let chunks: any = [],
					size = 0;
				if (response.status == 403) {
					rejects(new Error(i18nHelper.getMessage('130106')));
				}
				response.on("data", function (chunk: any) {
					chunks.push(chunk)
					size += chunk.length
				})

				response.on("end", function () {
					let data = Buffer.concat(chunks, size)
					if (settingsManager) {
						settingsManager.debug(`Obsidian-Douban:从网络获取文件完成:\n${url}`);
					}
					resolve(data)
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

}
