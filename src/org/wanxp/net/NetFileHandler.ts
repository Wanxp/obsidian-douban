import { requestUrl, RequestUrlParam} from "obsidian";
import {log} from "../utils/Logutil";
import {i18nHelper} from "../lang/helper";
import FileHandler from "../file/FileHandler";
import {FileUtil} from "../utils/FileUtil";
import HandleContext from "../douban/data/model/HandleContext";

export default class NetFileHandler {
	private fileHandler: FileHandler;

	constructor(fileHandler: FileHandler) {
		this.fileHandler = fileHandler;
	}

	async downloadFile(url: string, folder:string, filename: string, context:HandleContext, showError:boolean, headers?:any): Promise<{ success: boolean, error:string, filepath: string }> {
		const headersCookie = {Cookie: context.settings.loginCookiesContent}
		const headersInner = {};
		if(headers) {
			Object.assign(headersInner, headers, headersCookie);
		}else {
			Object.assign(headersInner, headersCookie);
		}

		const requestUrlParam: RequestUrlParam = {
			url: url,
			method: "GET",
			throw: true,
			headers: headersInner
		};
		const filePath:string = FileUtil.join(folder, filename);
		return requestUrl(requestUrlParam)
			.then((response) => {
				this.fileHandler.creatAttachmentWithData(filePath, response.arrayBuffer);
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
}


