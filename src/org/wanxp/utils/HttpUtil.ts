import SettingsManager from "../douban/setting/SettingsManager";
import {Platform, RequestUrlResponse} from "obsidian";
import DesktopHttpUtil from "./desktop/DesktopHttpUtil";
import MobileHttpUtil from "./mobile/MobileHttpUtil";


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
		settingsManager.debug(`Obsidian-Douban:从网络获取网页开始:\nurl:${url}\nheaders:${JSON.stringify(headers)}`);
		if (Platform.isDesktopApp) {
			return DesktopHttpUtil.httpRequestGet(url, headers, settingsManager)
		}else {
			return MobileHttpUtil.httpRequestGet(url, headers,  settingsManager).then((response:RequestUrlResponse) => {
				return response.text;
			});
		}

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
		settingsManager.debug(`Obsidian-Douban:从网络获取json开始:\nurl:${url}\nheaders:${JSON.stringify(headers)}`);
		if (Platform.isDesktopApp) {
			return DesktopHttpUtil.httpRequestGetJson(url, headers, settingsManager)
		}else {
			return MobileHttpUtil.httpRequestGet(url, headers,  settingsManager).then((response:RequestUrlResponse) => {
				return response.json;
			});
		}
	}

	/**
	 * get请求
	 * @param url 请求地址
	 * @param headers 请求参数
	 * @param settingsManager 设置管理器
	 */
	public static httpRequestGetBuffer(url: string, headers: any, settingsManager?: SettingsManager): Promise<ArrayBuffer> {
		if (Platform.isDesktopApp) {
			return DesktopHttpUtil.httpRequestGetBuffer(url, headers, settingsManager)
		}else {
			return MobileHttpUtil.httpRequestGet(url, headers,  settingsManager).then((response: RequestUrlResponse) => {
				return response.arrayBuffer;
			});
		}
	}


}
