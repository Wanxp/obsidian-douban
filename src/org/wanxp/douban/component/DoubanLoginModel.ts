import { Notice } from 'obsidian';
import { log } from 'src/org/wanxp/utils/Logutil';
import {i18nHelper} from "../../lang/helper";
import {DoubanSettingTab} from "../setting/DoubanSettingTab";
import SettingsManager from "../setting/SettingsManager";
import {constructDoubanTokenSettingsUI} from "../setting/BasicSettingsHelper";
import StringUtil from "../../utils/StringUtil";
import {Integer} from "schema-dts";

// Credits go to zhaohongxuan's Weread Plugin : https://github.com/zhaohongxuan/obsidian-weread-plugin


export default class DoubanLoginModel {
	private modal: any;
	private containerEl: HTMLElement;
	private settingsManager: SettingsManager;
	constructor(containerEl: HTMLElement, settingsManager: SettingsManager) {
		this.containerEl = containerEl;
		this.settingsManager = settingsManager;
		this.settingsManager.debug(`配置界面:初始化登录界面`)
		const { remote} = require('electron');

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

		this.modal.webContents.on('did-fail-load', (event:Event, errorCode:Integer ) => {
			// 例如, 当 Ctrl/Cmd are down 被按下，仅开启应用程序菜单键盘快捷键。
			this.settingsManager.debug('加载失败' + errorCode);
		})

		this.modal.webContents.on('did-fail-load', (event:Event)  => {
			// 例如, 当 Ctrl/Cmd are down 被按下，仅开启应用程序菜单键盘快捷键。
			this.settingsManager.debug('加载成功');
		})

		this.modal.webContents.on('did-navigate', async (_event: any, _url: string, httpResponseCode: number) => {
			if (httpResponseCode == 403) {
				// what you want to do
				this.settingsManager.debug(`配置界面:登录界面,加载页面失败,HttpStatus:${httpResponseCode},URL:${_url}`);
				await this.modal.loadURL('data:text/html;charset=utf-8;base64,55Sx5LqO5aSa5qyh6aKR57mB6K+35rGC5pWw5o2u77yM6LGG55Oj5b2T5YmN5pqC5pe25LiN5Y+v55SoLiDor7fkuo4xMuWwj+aXtuaIljI05bCP5pe25ZCO5YaN6YeN6K+V77yM5oiW6YeN572u5L2g55qE572R57ucKOWmgumHjeaWsOaLqOWPt+aIluabtOaNoue9kee7nCk=');
			}else {
				this.settingsManager.debug(`配置界面:登录界面,加载页面成功,HttpStatus:${httpResponseCode},URL:${_url}`);
			}
		});

		const session = this.modal.webContents.session;
		const filter = {
			urls: ['https://www.douban.com/']
		};
		session.webRequest.onSendHeaders(filter, async (details:any) => {
			this.settingsManager.debug(`配置界面:登录界面请求头检测:${details.url}`)
			const headers = details.requestHeaders;
			if (headers) {
				this.settingsManager.debug(`配置界面:登录界面请求检测，获取到Cookie`)
				let user = await settingsManager.plugin.userComponent.loginHeaders(headers);
				if (user && user.login) {
					this.settingsManager.debug(`配置界面:登录界面豆瓣登录成功, 信息:id:${StringUtil.confuse(user.id)}:, 用户名:${StringUtil.confuse(user.name)}`)
					session.clearStorageData(() => {
						this.settingsManager.debug(`配置界面:登录界面 登录前本地清理缓存成功2`)
					});
					this.onClose();
					return;
				}
				this.settingsManager.debug(`配置界面:登录界面豆瓣登录失败, headers未能成功获取用户信息`)
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
		// this.modal.destroy();
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
