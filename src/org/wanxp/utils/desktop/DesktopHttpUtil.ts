import SettingsManager from "../../douban/setting/SettingsManager";
import {i18nHelper} from "../../lang/helper";
import {LoginUtil} from "../LoginUtil";
import DoubanHumanCheckModel from "../../douban/component/DoubanHumanCheckModel";
import HttpUtil from "../HttpUtil";
import {HttpResponse} from "../model/HttpResponse";

var https: any = null;
var http: any = null;

export default class DesktopHttpUtil {

	/**
	 * get请求
	 * @param url 请求地址
	 * @param headers 请求参数
	 * @param settingsManager 设置管理器
	 */
	// Cookie: 'll="108296"; bid=xHRJLeWBrjQ; _pk_id.100001.8cb4=f8f83e81ec224a1a.1691572669.; __utmv=30149280.13103; __yadk_uid=ce95W7OsgT0iKFceWgbMSUdw1oOqxNTk; __gads=ID=62585f60f3f637d0-2234f63fc6e200a5:T=1691572672:RT=1691572672:S=ALNI_MaIqTxSWHsfpnX9nAmMHcPQEsaezg; __gpi=UID=00000c29a9f98e5b:T=1691572672:RT=1691572672:S=ALNI_MbLAq8XNoKrRPKNqGCMdgXSPZvidw; ap_v=0,6.0; __utma=30149280.135860784.1691572641.1691572641.1694509646.2; __utmc=30149280; __utmz=30149280.1694509646.2.2.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1694509648%2C%22https%3A%2F%2Fmovie.douban.com%2Ftv%2F%22%5D; _pk_ses.100001.8cb4=1; __utmt=1; dbcl2="131038721:LUssju34QFw"; ck=dCQj; push_noty_num=0; push_doumail_num=0; __utmb=30149280.3.10.1694509646'
	public static request(url: string, headers: any, settingsManager?: SettingsManager, options?: any): Promise<HttpResponse> {

		const {['Accept-Encoding']: acceptEncoding, ...headersInner} = headers;
		const optionsInner = {
			headers: headersInner,
			...options
		}
		return new Promise((resolve, rejects) => {
			this.httpRequest(url, optionsInner, 0, resolve, rejects, settingsManager);
		})
	}

	private static httpRequest(url: string, options: any, times: number, resolve: any, rejects: any, settingsManager?: SettingsManager) {
		settingsManager.debug(`Obsidian-Douban:从网络获取json开始:\nurl:${url}\nheaders:${JSON.stringify(options)}`);

		var method = options.method;
		if (method == null) {
			method = "GET";
		}
		if (method.toUpperCase() == "POST") {
			const {protocol, host, port, path} = HttpUtil.parse(url);

			const optionsInner = {
				hostname: host,
				port: port,
				path: path,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			};
			let req = null;
			try {

				req = DesktopHttpUtil.getHttpClient(url).request(optionsInner, function (response: any) {
					let chunks: any = [],
						size = 0;
					if (settingsManager) {
						settingsManager.debug(`Obsidian-Douban:从网络获取JSON完成${times}:url:\n${url}`);
						settingsManager.debug(`Obsidian-Douban:从网络获取JSON完成${times}:header:\n${JSON.stringify(response.headers)}`);
						settingsManager.debug(`Obsidian-Douban:从网络获取JSON完成${times}:body:\n${response.text}`);
					}

					response.on("data", function (chunk: any) {
						chunks.push(chunk)
						size += chunk.length
					})

					response.on("end", function () {
						const data = Buffer.concat(chunks, size)
						const html = data.toString()
						resolve(new HttpResponse(response.statusCode, response.headers, html))
					})
				});
			} catch (e) {
				rejects(e);
			}
			if (req) {
				const body = options.body;
				if (body) {
					req.write(body);
				} else {
					req.write('');
				}
				req.end();
			}
		} else {
			try {

				this.getHttpClient(url).get(url, {...options}, function (response: any) {
					let chunks: any = [],
						size = 0;
					if (settingsManager) {
						settingsManager.debug(`Obsidian-Douban:从网络获取JSON完成${times}:url:\n${url}`);
						settingsManager.debug(`Obsidian-Douban:从网络获取JSON完成${times}:header:\n${JSON.stringify(response.headers)}`);
						settingsManager.debug(`Obsidian-Douban:从网络获取JSON完成${times}:body:\n${response.text}`);
					}

					response.on("data", function (chunk: any) {
						chunks.push(chunk)
						size += chunk.length
					})

					response.on("end", function () {
						const data = Buffer.concat(chunks, size)
						const html = data.toString()
						resolve(new HttpResponse(response.statusCode, response.headers, html))
					})
				});
			} catch (e) {
				rejects(e);
			}
		}

	}

	private static getHttpClient(url?: string) {
		if (url && url.startsWith("https")) {
			if (!https) {
				https = require("follow-redirects").https;
			}
			return https;
		} else {
			if (!http) {
				http = require("follow-redirects").http;
			}
			return http;
		}

	}

	/**
	 * get请求
	 * @param url 请求地址
	 * @param headers 请求参数
	 * @param settingsManager 设置管理器
	 */
	public static requestBuffer(url: string, headers: any, settingsManager?: SettingsManager): Promise<HttpResponse> {
		let options = {
			headers: headers
		}

		return new Promise((resolve, rejects) => {
			this.httpRequestGetBufferInner(url, options, 0, resolve, rejects, settingsManager);
		})
	}

	private static httpRequestGetBufferInner(url: string, options: any, times: number, resolve: any, rejects: any, settingsManager?: SettingsManager) {
		if (settingsManager) {
			settingsManager.debug(`Obsidian-Douban:从网络获取文件开始:\n${url}\nheaders:${JSON.stringify(options)}`);

			this.getHttpClient(url).get(url, {...options}, function (response: any) {
				let chunks: any = [],
					size = 0;
				if (settingsManager) {
					settingsManager.debug(`Obsidian-Douban:从网络获取文件完成${times}:url:\n${url}`);
					settingsManager.debug(`Obsidian-Douban:从网络获取文件完成${times}:header:\n${JSON.stringify(response.headers)}`);
				}

				response.on("data", function (chunk: any) {
					chunks.push(chunk)
					size += chunk.length
				})

				response.on("end", function () {
					const data = Buffer.concat(chunks, size)
					resolve(new HttpResponse(response.statusCode, response.headers, data))
				})
			})
		}
	}

}
