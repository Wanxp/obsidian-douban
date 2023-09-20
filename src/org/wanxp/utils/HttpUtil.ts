import axios from "axios";
import {log} from "./Logutil";
import {i18nHelper} from "../lang/helper";
import SettingsManager from "../douban/setting/SettingsManager";
import {request,  RequestUrlParam} from "obsidian";
import DoubanHumanCheckModel from "../douban/component/DoubanHumanCheckModel";

export default class HttpUtil {
	/**
	 * get请求
	 * @param url 请求地址
	 * @param headers 请求参数
	 * @param settingsManager 设置管理器
	 */
	public static httpRequestGet(url: string, headers:any, settingsManager?:SettingsManager): Promise<string> {
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
				if(e.toString().indexOf('403') > 0) {
					throw log.error(i18nHelper.getMessage('130105'), e)
				}else {
					throw log.error(i18nHelper.getMessage('130101').replace('{0}',   e.toString()), e)
				}
			})


	}


	public static async humanCheck(html:any, url:string, settingsManager?: SettingsManager):Promise<any> {
		if (settingsManager) {
			settingsManager.debug(html);
		}
		if (html && html.indexOf("<title>禁止访问</title>") != -1) {
			const loginModel = new DoubanHumanCheckModel(url);
			await loginModel.load();
			return '';
		}else {
			return html;
		}



	}

	/**
	 * get请求
	 * @param url 		请求地址
	 * @param settingsManager 设置管理器
	 */
	public static httpRequestGetUrl(url: string, settingsManager?:SettingsManager): Promise<string> {
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
				if(e.toString().indexOf('403') > 0) {
					throw log.error(i18nHelper.getMessage('130105'), e)
				}else {
					throw log.error(i18nHelper.getMessage('130101').replace('{0}',   e.toString()), e)
				}
			})
	}

}
