import { requestUrl, RequestUrlParam} from "obsidian";
import {log} from "../utils/Logutil";
import {i18nHelper} from "../lang/helper";
import FileHandler from "../file/FileHandler";
import {FileUtil} from "../utils/FileUtil";
import HandleContext from "../douban/data/model/HandleContext";
import HttpUtil from "../utils/HttpUtil";
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
				if (response.status == 404) {
					throw new Error(i18nHelper.getMessage('130404'));
				}
				if (response.status == 403) {
					throw new Error(i18nHelper.getMessage('130106'));
				}
				return response.textArrayBuffer;
			})
			.then((buffer) => {
				if (!buffer || buffer.byteLength == 0) {
					return 0;
				}
				this.fileHandler.creatAttachmentWithData(filePath, buffer);
				return buffer.byteLength;
			}).then((size) => {
				if (size == 0) {
					return {success: false, size: size, error: '文件唯恐', filepath: null};
				}
				return {success: true, size: size, error: '', filepath: filePath};
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
			.then(async (buffer) => {
				const tempFilePath = this.getPicGoTempFilePath(filename, context);
				try {
					await this.fileHandler.creatAttachmentWithData(tempFilePath.relativePath, buffer);
					return await this.uploadClipboardFile(context, tempFilePath.absolutePath);
				} finally {
					await this.fileHandler.deleteFile(tempFilePath.relativePath);
				}
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


	private getPicGoTempFilePath(filename: string, context: HandleContext) {
		const tempFileName = `${Date.now()}_${filename}`;
		const relativePath = FileUtil.join(this.fileHandler.getTmpPath(), tempFileName);
		// @ts-ignore
		const adapter = context.plugin.app.vault.adapter;
		// @ts-ignore
		const basePath = adapter && adapter.getBasePath ? adapter.getBasePath() : this.fileHandler.getRootPath();
		return {
			relativePath: relativePath,
			absolutePath: FileUtil.join(basePath, relativePath),
		};
	}

	async uploadClipboardFile(context:HandleContext, filePath?: string): Promise<ResultI> {
		const body = filePath ? JSON.stringify({list: [filePath]}) : null;
		const response = await HttpUtil.httpRequest(
			context.settings.pictureBedSetting.url, {}, context.plugin.settingsManager, {method: "post", body: body});
		const data = response.textJson as ResultI;
		return data;
	}

	async downloadDBUploadPicGoByClipboardBefore(context: HandleContext) {
		//临时限定只支持PicGo
		try {
			const response = await HttpUtil.httpRequest(
				HttpUtil.replaceUrlPath(context.settings.pictureBedSetting.url, '/heartbeat'), {}, context.plugin.settingsManager, {method: "post"});
			const data = response.textJson as ResultI;
			return data? data.success: false;
		}catch (e) {
			return false;
		}

	}
}
