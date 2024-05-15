import { requestUrl, RequestUrlParam} from "obsidian";
import {log} from "../utils/Logutil";
import {i18nHelper} from "../lang/helper";
import FileHandler from "../file/FileHandler";
import {FileUtil} from "../utils/FileUtil";
import HandleContext from "../douban/data/model/HandleContext";
import HttpUtil from "../utils/HttpUtil";
import {ClipboardUtil} from "../utils/ClipboardUtil";
import {ResultI} from "../utils/model/Result";

export default class NetFileHandler {
	private fileHandler: FileHandler;

	constructor(fileHandler: FileHandler) {
		this.fileHandler = fileHandler;
	}

	async downloadDBFile(url: string, folder:string, filename: string, context:HandleContext, showError:boolean, headers?:any): Promise<{ success: boolean, error:string, filepath: string }> {
		const filePath:string = FileUtil.join(folder, filename);
		return HttpUtil.httpRequestBuffer(url, headers, context.plugin.settingsManager)
			.then((response) => {
				if (response.status == 403) {
					throw new Error(i18nHelper.getMessage('130106'));
				}
				return response.textArrayBuffer;
			})
			.then((buffer) => {
				this.fileHandler.creatAttachmentWithData(filePath, buffer);
			}).then(() => {
				return {success: true, error: '', filepath: filePath};
			})
			.catch(e => {
				if (showError) {
					return log
						.error(
							i18nHelper.getMessage('130101')
								.replace('{0}',  e.toString())
							, e);
				}else {
					console.error(e);
				}
			});
		;
	}

	async downloadDBUploadPicGoByClipboard(url: string, filename: string, context:HandleContext, showError:boolean, headers?:any): Promise<{ success: boolean, error:string, filepath: string }> {
		return HttpUtil.httpRequestBuffer(url, headers, context.plugin.settingsManager)
			.then((response) => {
				if (response.status == 403) {
					throw new Error(i18nHelper.getMessage('130106'));
				}
				return response.textArrayBuffer;
			})
			.then((buffer) => {
				ClipboardUtil.writeImage(buffer);
			}).then(() => {
				return this.uploadClipboardFile(context);
			}).then((data) => {
				if (data.success) {
					return {success: true, error: '', filepath: HttpUtil.extractURLFromString(data.result[0])};
				}else {
					throw new Error('图片上传图床失败,使用原始图片地址，错误消息:' + data.message)
				}
			})
			.catch(e => {
				if (showError) {
					return log
						.error(
							i18nHelper.getMessage('130101')
								.replace('{0}',  e.toString())
							, e);
				}else {
					console.error(e);
				}
			});
		;
	}


	async uploadClipboardFile(context:HandleContext): Promise<ResultI> {
		const response = await HttpUtil.httpRequest(
			context.settings.pictureBedSetting.url, {}, context.plugin.settingsManager, {method: "post"});
		const data = response.textJson as ResultI;
		return data;
	}
}


