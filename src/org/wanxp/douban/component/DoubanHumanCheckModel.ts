import { Notice } from 'obsidian';
import { log } from 'src/org/wanxp/utils/Logutil';
import {i18nHelper} from "../../lang/helper";
import {DoubanSettingTab} from "../setting/DoubanSettingTab";
import SettingsManager from "../setting/SettingsManager";
import {constructDoubanTokenSettingsUI} from "../setting/BasicSettingsHelper";

// Credits go to zhaohongxuan's Weread Plugin : https://github.com/zhaohongxuan/obsidian-weread-plugin


export default class DoubanHumanCheckModel {
	private modal: any;
	private url:string;
	constructor(url:string) {
		this.url = url;
		const { remote } = require('electron');
		const { BrowserWindow: RemoteBrowserWindow } = remote;
		this.modal = new RemoteBrowserWindow({
			parent: remote.getCurrentWindow(),
			width: 960,
			height: 540,
			show: false
		});

		this.modal.once('ready-to-show', () => {
			this.modal.setTitle(i18nHelper.getMessage('100102'));
			this.modal.show();
		});


		const session = this.modal.webContents.session;
		const filter = {
			urls: [this.url]
		};
		session.webRequest.onSendHeaders(filter, async (details:any) => {
			const cookies = details.requestHeaders['Cookie'];
			const cookieArr = this.parseCookies(cookies);
			// const wr_name = cookieArr.find((cookie) => cookie.name == 'wr_name').value;
			if (cookieArr) {
				this.onClose();
			} else {
				this.onReload();
			}
		});
	}

	private parseCookies(cookies: any) {
		return cookies;
	}

	async load() {
		try {
			await this.modal.loadURL(this.url);
		} catch (error) {
			log.error(i18nHelper.getMessage('100101'), error)
		}
	}

	async loadUrl(url:string) {
		try {
			await this.modal.loadURL(url);
		} catch (error) {
			log.error(i18nHelper.getMessage('100101'), error)
		}
	}

	async loadHtml(html:string) {
		try {
			await this.modal.loadURL(`data:text/html;charset=utf-8,${html}`);
		} catch (error) {
			log.error(i18nHelper.getMessage('100101'), error)
		}
	}

	onClose() {
		this.modal.close();
		new Notice(i18nHelper.getMessage('100103'))
	}

	onReload() {
		this.modal.reload();
	}
}
