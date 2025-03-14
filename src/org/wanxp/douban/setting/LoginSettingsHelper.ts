import I18nHelper, {i18nHelper} from "../../lang/helper";
import {Platform, Setting} from "obsidian";
import SettingsManager from "./SettingsManager";
import DoubanLoginModel from "../component/DoubanLoginModel";
import User from "../user/User";
import StringUtil from "../../utils/StringUtil";
import {log} from "../../utils/Logutil";

export function constructLoginUI(containerEl: HTMLElement, manager: SettingsManager) {
	// containerEl.createEl('h3', { text: i18nHelper.getMessage('1210') });

	const userComponent = manager.plugin.userComponent;
	if (userComponent.needLogin()) {
		try {
			userComponent.login()
				.then(() => {
					constructDoubanLoginSettingsUI(containerEl, manager);
				});
		}catch (e) {
			log.debug(i18nHelper.getMessage('100101'));
			constructDoubanLoginSettingsUI(containerEl, manager);
		}
	}else {
		constructDoubanLoginSettingsUI(containerEl, manager);
	}

}

export function constructDoubanLoginSettingsUI(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.createDiv('login-setting', async (loginSettingEl) => {
		constructDoubanTokenSettingsUI(loginSettingEl, manager);
	});
}


export function constructDoubanTokenSettingsUI(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.empty();
	let login = manager.plugin.userComponent.isLogin();
	manager.debug(`配置界面:展示豆瓣状态:${login?'已登录':'未登录'}`)
	if (Platform.isDesktopApp) {
		if(login) {
			constructHasLoginSettingsUI(containerEl, manager);
		}else {
			constructLoginSettingsUI(containerEl, manager);
		}
	} else {
		if(login) {
			showMobileLogout(containerEl, manager);
		}else {
			showMobileLogin(containerEl, manager);
		}
	}


}


export function constructLoginSettingsUI(containerEl: HTMLElement, manager: SettingsManager) {
	manager.debug(`配置界面:未登录-展示登录按钮`)
	let loginSetting = containerEl.createDiv("login-button");
	let loginCookie = containerEl.createDiv("login-button-cookie");

	new Setting(loginSetting).setName(i18nHelper.getMessage('100131')).addButton((button) => {
		return button
			.setButtonText(i18nHelper.getMessage('100130'))
			.onClick(async () => {
				button.setDisabled(true);
				manager.debug(`配置界面:点击登录按钮`)
				const loginModel = new DoubanLoginModel(containerEl, manager);
				await loginModel.doLogin();
			});
	});
	const loginCookieSetting:Setting = new Setting(loginSetting).setName(i18nHelper.getMessage('100133'));
		// .setDesc(i18nHelper.getMessage('100134'))
	loginCookieSetting.addButton((button) => {
		loginCookieSetting.descEl.appendChild(
				createFragment((frag) => {
					frag.appendText(
						i18nHelper.getMessage('100134')
					);
					frag.createEl(
						'a',
						{
							text: i18nHelper.getMessage('100139'),
							href: 'https://wanxp.github.io/obsidian-douban/20_howtouse_25_setting_login_douban_cookie.html',
						},
						(a) => {
							a.setAttr('target', '_blank');
						}
					);
					frag.appendText(i18nHelper.getMessage('100138'));
				})
			);


		return button
			.setButtonText(i18nHelper.getMessage('100135'))
			.onClick(async () => {
				button.setDisabled(true);
				manager.debug(`配置界面:点击登录异常处理按钮`)
				constructLoginCookieSettingsUI(loginCookie, containerEl, manager);
			});
	});
}

export function constructLoginCookieSettingsUI(containerEl: HTMLElement, parentContainerEl: HTMLElement, manager: SettingsManager) {
	manager.debug(`配置界面:登录异常处理按钮-展示Cookie输入框`)
	new Setting(containerEl).setName(i18nHelper.getMessage('100136'))
		.setClass("obsidian_douban_settings_cookie_login").addTextArea((text) => {
		text.onChange(value => manager.updateCookieTemp(value));
		return text;
	}).addExtraButton((button) => {
		return button
			.setIcon('check')
			.onClick(async () => {
				manager.debug(`配置界面:确认输入Cookie`);
				const user:User = await manager.plugin.userComponent.loginCookie(manager.getCookieTemp())
				if (!user || !user.id) {
					log.notice(i18nHelper.getMessage('100137'))
					return;
				}
				constructDoubanTokenSettingsUI(parentContainerEl, manager);
			});
	})
		.addExtraButton((button) => {
			return button
				.setIcon('x')
				.onClick(async () => {
					button.setDisabled(true);
					manager.debug(`配置界面:取消输入Cookie`);
					constructDoubanTokenSettingsUI(parentContainerEl, manager);
				});
		});
}

export function constructHasLoginSettingsUI(containerEl: HTMLElement, manager: SettingsManager) {
	const user: User = manager.plugin.userComponent.getUser();
	let userDom = new DocumentFragment();
	userDom.createDiv().innerHTML =
		`${i18nHelper.getMessage('100120')}<br>
${i18nHelper.getMessage('100123')}: <a href="https://www.douban.com/people/${user.id}/">${user.id}</a><br>
		${i18nHelper.getMessage('100124')}: ${user.name}<br>
${i18nHelper.getMessage('100125')}`;
	manager.debug(`配置界面:展示豆瓣登录信息:id:${StringUtil.confuse(user.id)}, 用户名:${StringUtil.confuse(user.name)}`)
	new Setting(containerEl)
		.setName(i18nHelper.getMessage('100126'))
		.setDesc(userDom)
		.addButton((button) => {
		return button
			.setButtonText(i18nHelper.getMessage('100128'))
			.setCta()
			.onClick(async () => {
				button.setDisabled(true);
				manager.debug(`配置界面:点击退出登录按钮，准备退出登录`)
				// manager.debug(`配置界面:登出界面退出登录请求检测成功，准备退出登录`)
				manager.plugin.userComponent.logout();
				manager.debug(`配置界面:退出登录成功`);
				constructDoubanTokenSettingsUI(containerEl, manager);
			});
	});
}

function showMobileLogin(containerEl: HTMLElement, manager: SettingsManager) {
	new Setting(containerEl)
		.setName(i18nHelper.getMessage('100126'))
		.setDesc(i18nHelper.getMessage('100129'))
}

function showMobileLogout(containerEl: HTMLElement, manager: SettingsManager) {
	const user: User = manager.plugin.userComponent.getUser();
	let userDom = new DocumentFragment();
	userDom.createDiv().innerHTML =
		`${i18nHelper.getMessage('100120')}<br>
${i18nHelper.getMessage('100123')}: <a href="https://www.douban.com/people/${user.id}/">${user.id}</a><br>
		${i18nHelper.getMessage('100124')}: ${user.name}<br>
${i18nHelper.getMessage('100125')}`;
	new Setting(containerEl)
		.setName(i18nHelper.getMessage('100126'))
		.setDesc(userDom)
		.addButton((button) => {
			return button
				.setButtonText(i18nHelper.getMessage('100128'))
				.setCta()
				.onClick(async () => {
					button.setDisabled(true);
					manager.updateSetting('loginCookiesContent', '');
					manager.updateSetting('loginHeadersContent', '');
					constructDoubanTokenSettingsUI(containerEl, manager);
				});
		});
}

