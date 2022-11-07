import {DoubanSettingTab} from "@App/setting/DoubanSettingTab";
import {i18nHelper} from "../../lang/helper";
import SettingsManager from "@App/setting/SettingsManager";
import {constructDoubanTokenSettingsUI, constructLoginSettingsUI} from "@App/setting/BasicSettingsHelper";
import {log} from "../../utils/Logutil";

// Credits go to zhaohongxuan's Weread Plugin : https://github.com/zhaohongxuan/obsidian-weread-plugin


export default class DoubanLogoutModel {
	private modal: any;
	private settingsManager: SettingsManager;
	constructor(containerEl: HTMLElement, settingsManager: SettingsManager) {
		this.settingsManager = settingsManager;
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
			urls: ['https://www.douban.com/']
		};
		session.webRequest.onCompleted(filter, (details:any) => {
			if (details.statusCode == 200) {
				this.settingsManager.plugin.userComponent.logout();
				constructDoubanTokenSettingsUI(containerEl, settingsManager);
				this.modal.close();
			}
		});
	}

	async doLogout() {
		await this.modal.loadURL('https://www.douban.com/');
	}

	onClose() {
		this.modal.close();
	}
}
