import {DoubanSettingTab} from "@App/setting/DoubanSettingTab";
import {i18nHelper} from "../../lang/helper";
import SettingsManager from "@App/setting/SettingsManager";
import {constructDoubanTokenSettingsUI, constructLoginSettingsUI} from "@App/setting/BasicSettingsHelper";
import {log} from "../../utils/Logutil";

// Credits go to zhaohongxuan's Weread Plugin : https://github.com/zhaohongxuan/obsidian-weread-plugin


export default class DoubanLogoutModel {
	private modal: any;
	private containerEl: HTMLElement;
	private settingsManager: SettingsManager;
	constructor(containerEl: HTMLElement, settingsManager: SettingsManager) {
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
		const session = this.modal.webContents.session;
		const filter = {
			urls: ['https://www.douban.com/accounts/logout']
		};
		session.webRequest.onCompleted(filter, (details:any) => {
			log.info('已请求登出成功:');
			if (details.statusCode == 200) {
				this.settingsManager.updateSetting('loginCookiesContent', '');
				constructDoubanTokenSettingsUI(containerEl, settingsManager);
				this.modal.close();
			}
		});
	}

	async doLogout() {
		await this.modal.loadURL('https://www.douban.com/logout');
	}

	onClose() {
		this.modal.close();
	}
}
