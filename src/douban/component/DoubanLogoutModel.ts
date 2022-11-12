import {DoubanSettingTab} from "@App/setting/DoubanSettingTab";
import {i18nHelper} from "../../lang/helper";
import SettingsManager from "@App/setting/SettingsManager";
import {constructDoubanTokenSettingsUI, constructLoginSettingsUI} from "@App/setting/BasicSettingsHelper";
import {log} from "../../utils/Logutil";

// Credits go to zhaohongxuan's Weread Plugin : https://github.com/zhaohongxuan/obsidian-weread-plugin


export default class DoubanLogoutModel {
	private modal: any;
	private settingsManager: SettingsManager;
	private containerEl: HTMLElement;
	constructor(containerEl: HTMLElement, settingsManager: SettingsManager) {
		this.settingsManager = settingsManager;
		this.containerEl = containerEl;
		const { remote } = require('electron');
		const { BrowserWindow: RemoteBrowserWindow } = remote;
		this.modal = new RemoteBrowserWindow({
			parent: remote.getCurrentWindow(),
			width: 960,
			height: 540,
			show: false
		});
		this.modal.once('ready-to-show', () => {
			this.modal.setTitle(i18nHelper.getMessage('100101'));
			this.modal.show();
		});
		this.modal.on('closed', () => {
			constructDoubanTokenSettingsUI(this.containerEl, this.settingsManager);
		});
		const session = this.modal.webContents.session;
		const filter = {
			urls: ['https://www.douban.com/',
			'https://www.douban.com/accounts/logout']
		};
		session.webRequest.onSendHeaders(filter, (details:any) => {
			const cookies = details.requestHeaders['Cookie'];
			// const wr_name = cookieArr.find((cookie) => cookie.name == 'wr_name').value;
			if (cookies && cookies.indexOf('dbcl2') < 0) {
				this.settingsManager.plugin.userComponent.logout();
				this.onClose();
			}
		});
	}

	async doLogout() {
		await this.modal.loadURL('https://www.douban.com/accounts/logout?source=main&ck=DfFJ');
	}

	onClose() {
		this.modal.close();
	}
}
