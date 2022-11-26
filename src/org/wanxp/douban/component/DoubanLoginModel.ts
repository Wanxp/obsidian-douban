import { Notice } from 'obsidian';
import { log } from 'src/org/wanxp/utils/Logutil';
import {i18nHelper} from "../../lang/helper";
import {DoubanSettingTab} from "../setting/DoubanSettingTab";
import SettingsManager from "../setting/SettingsManager";
import {constructDoubanTokenSettingsUI} from "../setting/BasicSettingsHelper";
import StringUtil from "../../utils/StringUtil";

// Credits go to zhaohongxuan's Weread Plugin : https://github.com/zhaohongxuan/obsidian-weread-plugin


export default class DoubanLoginModel {
	private modal: any;
	private containerEl: HTMLElement;
	private settingsManager: SettingsManager;
	constructor(containerEl: HTMLElement, settingsManager: SettingsManager) {
		this.containerEl = containerEl;
		this.settingsManager = settingsManager;
		this.settingsManager.debug(`配置界面:初始化登录界面`)
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
			urls: ['https://www.douban.com/','https://accounts.douban.com/','https://accounts.douban.com/passport/login']
		};
		session.webRequest.onSendHeaders(filter, async (details:any) => {
			this.settingsManager.debug(`配置界面:登录界面请求头检测:${details.url}`)
			const cookies = details.requestHeaders['Cookie'];
			const cookieArr = this.parseCookies(cookies);
			// const wr_name = cookieArr.find((cookie) => cookie.name == 'wr_name').value;
			if (cookieArr) {
				this.settingsManager.debug(`配置界面:登录界面请求检测，获取到Cookie`)
				let user = await settingsManager.plugin.userComponent.loginCookie(cookieArr);
				if (user && user.login) {
					this.settingsManager.debug(`配置界面:登录界面豆瓣登录成功, 信息:id:${StringUtil.confuse(user.id)}:, 用户名:${StringUtil.confuse(user.name)}`)
					this.onClose();
					return;
				}
				this.settingsManager.debug(`配置界面:登录界面豆瓣登录失败, cookies未能成功获取用户信息`)
			} else {
				this.settingsManager.debug(`配置界面:登录界面请求检测，没有获取到Cookie`)
				this.onReload();
			}
		});
	}

	private parseCookies(cookies: any) {
		return cookies;
	}

	async doLogin() {
		try {
			this.settingsManager.debug(`配置界面:登录界面加载登录页面`)
			await this.modal.loadURL('https://accounts.douban.com/passport/login');
		} catch (error) {
			log.error(i18nHelper.getMessage('100101'), error)
		}
	}

	onClose() {
		this.settingsManager.debug(`配置界面:登录界面关闭, 自动退出登录界面`)
		this.modal.close();
	}

	onReload() {
		this.settingsManager.debug(`配置界面:登录界面重新加载`)
		this.modal.reload();
	}

	private showCloseMessage() {
		if(this.settingsManager.plugin.userComponent.isLogin()) {
			this.settingsManager.debug(`配置界面:登录界面关闭, 但未检测到登出, 登录失败`)
		}else {
			this.settingsManager.debug(`配置界面:登录界面关闭, 登录成功`)
		}
	}
}
