import {DoubanSettingTab} from "../setting/DoubanSettingTab";
import {i18nHelper} from "../../lang/helper";
import SettingsManager from "../setting/SettingsManager";
import {constructDoubanTokenSettingsUI, constructLoginSettingsUI} from "../setting/BasicSettingsHelper";
import {log} from "../../utils/Logutil";

// Credits go to zhaohongxuan's Weread Plugin : https://github.com/zhaohongxuan/obsidian-weread-plugin


export default class DoubanLogoutModel {
	private modal: any;
	private settingsManager: SettingsManager;
	private containerEl: HTMLElement;
	constructor(containerEl: HTMLElement, settingsManager: SettingsManager) {
		this.settingsManager = settingsManager;
		this.settingsManager.debug(`配置界面:初始化登出界面`)
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
			this.showCloseMessage();
			constructDoubanTokenSettingsUI(this.containerEl, this.settingsManager);
		});
		const session = this.modal.webContents.session;
		const filter = {
			urls: ['https://www.douban.com/',
			'https://www.douban.com/accounts/logout']
		};
		session.webRequest.onSendHeaders(filter, (details:any) => {
			this.settingsManager.debug(`配置界面:登出界面请求头检测:${details.url}`)
			const cookies = details.requestHeaders['Cookie'];
			// const wr_name = cookieArr.find((cookie) => cookie.name == 'wr_name').value;
			if (cookies && cookies.indexOf('dbcl2') < 0) {
				this.settingsManager.debug(`配置界面:登出界面退出登录请求检测成功，准备退出登录`)
				this.settingsManager.plugin.userComponent.logout();
				this.settingsManager.debug(`配置界面:登出界面退出登录成功`)
				this.onClose();
			}
		});
	}

	async doLogout() {
		this.settingsManager.debug(`配置界面:登出界面加载登出页面`)
		await this.modal.loadURL('https://www.douban.com/accounts/logout?source=main&ck=DfFJ');
	}

	onClose() {
		this.settingsManager.debug(`配置界面:登出界面关闭, 自动退出登出界面`)
		this.modal.close();
	}

	private showCloseMessage() {
		if(this.settingsManager.plugin.userComponent.isLogin()) {
			this.settingsManager.debug(`配置界面:登出界面关闭, 但未检测到登出, 退出登录失败`)
		}else {
			this.settingsManager.debug(`配置界面:登出界面关闭, 退出登录成功`)
		}
	}
}
