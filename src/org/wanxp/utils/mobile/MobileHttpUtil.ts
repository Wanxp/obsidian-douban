import SettingsManager from "../../douban/setting/SettingsManager";
import {requestUrl, RequestUrlParam, RequestUrlResponse} from "obsidian";
import {log} from "../Logutil";
import {i18nHelper} from "../../lang/helper";
import {DoubanHttpUtil} from "../DoubanHttpUtil";
import {request} from "https";

export default class MobileHttpUtil {
	/**
	 * get请求
	 * @param url 请求地址
	 * @param headers 请求参数
	 * @param settingsManager 设置管理器
	 */
	public static httpRequestGet(url: string, headers: any, settingsManager?: SettingsManager): Promise<RequestUrlResponse> {
		return this.httpRequestGetInner(url, headers, 0, settingsManager);
	}
	private static async httpRequestGetInner(url: string, headers: any, times:number, settingsManager?: SettingsManager): Promise<RequestUrlResponse> {

		const {Cookie, ...headersInner} = headers;

		let requestUrlParam: RequestUrlParam = {
			url: url,
			method: "GET",
			headers: {'Cookie': Cookie},
			throw: true,
		};
		return await requestUrl(requestUrlParam)
			// .then(res => res.text)
			.then(response => {
				if (response && response.text.indexOf('https://sec.douban.com/a') > 0) {
					log.notice(i18nHelper.getMessage('130105'))
					if (settingsManager) {
						settingsManager.debug(`Obsidian-Douban:获取异常网页如下:\n${response}`);
					}
				}
				if (response.status == 301 || response.status == 302 || response.status == 303 || response.status == 307) {
					if (times > 2) {
						throw new Error('重定向次数过多');
					}
					let location = response.headers['location'];
					settingsManager.debug(`Obsidian-Douban:获取重定向地址如下:\n${location}`);
					if (location.indexOf('http') != 0) {
						return this.httpRequestGetInner(location, headers, times + 1, settingsManager);
					} else {
						throw new Error('重定地址错误');
					}
				}
				settingsManager.debug(`Obsidian-Douban:获取网页如下:\n${response}`);
				return response;
			})
			.then(s => DoubanHttpUtil.humanCheck(s, url, settingsManager))
			.catch(e => {
				if (e.toString().indexOf('403') > 0) {
					throw log.error(i18nHelper.getMessage('130105'), e)
				} else {
					throw log.error(i18nHelper.getMessage('130101').replace('{0}', e.toString()), e)
				}
			});
	}




}
