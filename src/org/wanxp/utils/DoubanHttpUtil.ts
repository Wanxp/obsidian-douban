import SettingsManager from "../douban/setting/SettingsManager";
import {Platform, RequestUrlResponse} from "obsidian";
import DesktopHttpUtil from "./desktop/DesktopHttpUtil";
import MobileHttpUtil from "./mobile/MobileHttpUtil";
import FileHandler from "../file/FileHandler";
import HandleContext from "../douban/data/model/HandleContext";
import {FileUtil} from "./FileUtil";
import HttpUtil from "./HttpUtil";
import {log} from "./Logutil";
import {i18nHelper} from "../lang/helper";
import {ClipboardUtil} from "./ClipboardUtil";
import DoubanHumanCheckModel from "../douban/component/DoubanHumanCheckModel";

export class DoubanHttpUtil {
	/**
	 * get请求
	 * @param url 请求地址
	 * @param headers 请求参数
	 * @param settingsManager 设置管理器
	 */
	// Cookie: 'll="108296"; bid=xHRJLeWBrjQ; _pk_id.100001.8cb4=f8f83e81ec224a1a.1691572669.; __utmv=30149280.13103; __yadk_uid=ce95W7OsgT0iKFceWgbMSUdw1oOqxNTk; __gads=ID=62585f60f3f637d0-2234f63fc6e200a5:T=1691572672:RT=1691572672:S=ALNI_MaIqTxSWHsfpnX9nAmMHcPQEsaezg; __gpi=UID=00000c29a9f98e5b:T=1691572672:RT=1691572672:S=ALNI_MbLAq8XNoKrRPKNqGCMdgXSPZvidw; ap_v=0,6.0; __utma=30149280.135860784.1691572641.1691572641.1694509646.2; __utmc=30149280; __utmz=30149280.1694509646.2.2.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1694509648%2C%22https%3A%2F%2Fmovie.douban.com%2Ftv%2F%22%5D; _pk_ses.100001.8cb4=1; __utmt=1; dbcl2="131038721:LUssju34QFw"; ck=dCQj; push_noty_num=0; push_doumail_num=0; __utmb=30149280.3.10.1694509646'
	public static async httpRequestGet(url: string, headers: any, settingsManager?: SettingsManager): Promise<string> {
		settingsManager.debug(`请求地址:${url}`);
		const {['Accept-Encoding']: acceptEncoding, ...headersInner} = headers;
		settingsManager.debug(`Obsidian-Douban:从网络获取网页开始:\nurl:${url}\nheaders:${JSON.stringify(headers)}`);
		const response = await HttpUtil.getText(url, headers, settingsManager);
		if (response.status == 403) {
			throw new Error(i18nHelper.getMessage('130106'));
		}
		const html = response.textString;
		return await this.humanCheck(html, url)
	}

	private fileHandler: FileHandler;

	constructor(fileHandler: FileHandler) {
		this.fileHandler = fileHandler;
	}

	public static async humanCheck(html: any, url: string, settingsManager?: SettingsManager): Promise<any> {
		if (!html) {
			return html;
		}
		if (settingsManager) {
			settingsManager.debug(html);
		}
		if (html && html.toString().indexOf("<title>禁止访问</title>") != -1) {
			const loginModel = new DoubanHumanCheckModel(url);
			await loginModel.load();
			return '';
		} else {
			return html;
		}
	}

}
