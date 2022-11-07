import {i18nHelper} from "../../lang/helper";
import {Platform, Setting} from "obsidian";
import {DEFAULT_SETTINGS} from "../../constant/DefaultSettings";
import SettingsManager from "@App/setting/SettingsManager";
import DoubanLoginModel from "@App/component/DoubanLoginModel";
import DoubanLogoutModel from "@App/component/DoubanLogoutModel";
import User from "@App/user/User";

export function constructBasicUI(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.createEl('h3', { text: i18nHelper.getMessage('1210') });
	containerEl.createDiv('login-setting', async (loginSettingEl) => {
		constructDoubanTokenSettingsUI(loginSettingEl, manager);
	});

	new Setting(containerEl).setName(i18nHelper.getMessage('120501')).then((setting) => {
		setting.addMomentFormat((mf) => {
			setting.descEl.appendChild(
				createFragment((frag) => {
					frag.appendText(
						i18nHelper.getMessage('120503')
					);
					frag.createEl('br');
					frag.appendText(i18nHelper.getMessage('120506') + ' ');
					frag.createEl(
						'a',
						{
							text: i18nHelper.getMessage('120508'),
							href: 'https://momentjs.com/docs/#/displaying/format/',
						},
						(a) => {
							a.setAttr('target', '_blank');
						}
					);
					frag.createEl('br');
					frag.appendText(i18nHelper.getMessage('120507') + ': ');
					mf.setSampleEl(frag.createEl('b', {cls: 'u-pop'}));
					frag.createEl('br');
				})
			);
			mf.setPlaceholder(DEFAULT_SETTINGS.dateFormat);
			mf.setValue(manager.plugin.settings.dateFormat)
			mf.onChange(async (value) => {
				manager.plugin.settings.dateFormat = value;
				await manager.plugin.saveSettings();
			});

		});
	});

	new Setting(containerEl).setName(i18nHelper.getMessage('120502')).then((setting) => {
		setting.addMomentFormat((mf) => {
			setting.descEl.appendChild(
				createFragment((frag) => {
					frag.appendText(
						i18nHelper.getMessage('120504')
					);
					frag.createEl('br');
					frag.appendText(i18nHelper.getMessage('120506') + ' ');
					frag.createEl(
						'a',
						{
							text: i18nHelper.getMessage('120508'),
							href: 'https://momentjs.com/docs/#/displaying/format/',
						},
						(a) => {
							a.setAttr('target', '_blank');
						}
					);
					frag.createEl('br');
					frag.appendText(i18nHelper.getMessage('120507') + ': ');
					mf.setSampleEl(frag.createEl('b', {cls: 'u-pop'}));
					frag.createEl('br');
				})
			);
			mf.setPlaceholder(DEFAULT_SETTINGS.timeFormat);
			mf.setValue(manager.plugin.settings.timeFormat)
			mf.onChange(async (value) => {
				manager.plugin.settings.timeFormat = value;
				await manager.plugin.saveSettings();
			});

		});
	});

	new Setting(containerEl)
		.setName(i18nHelper.getMessage('121401'))
		.setDesc(i18nHelper.getMessage('121402'))
		.addToggle((toggleComponent) => {
			toggleComponent
				// .setTooltip(i18nHelper.getMessage('121403'))
				.setValue(manager.plugin.settings.statusBar)
				.onChange(async (value) => {
					manager.plugin.settings.statusBar = value;
					await manager.plugin.saveSettings();
				});
		});
}

export function constructDoubanTokenSettingsUI(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.empty();
	let login = manager.plugin.userComponent.isLogin();
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
	new Setting(containerEl).setName('登录豆瓣').addButton((button) => {
		return button
			.setButtonText('登录')
			.setCta()
			.onClick(async () => {
				button.setDisabled(true);
				const loginModel = new DoubanLoginModel(containerEl, manager);
				await loginModel.doLogin();
			});
	});
}

export function constructHasLoginSettingsUI(containerEl: HTMLElement, manager: SettingsManager) {
	const user: User = manager.plugin.userComponent.getUser();
	let userDom = new DocumentFragment();
	userDom.createDiv().innerHTML =
		`已登录<br>
豆瓣ID: <a href="https://www.douban.com/people/${user.id}/">${user.id}</a><br>
		昵称: ${user.name}`;

	new Setting(containerEl)
		.setName('豆瓣用户信息')
		.setDesc(userDom)
		.addButton((button) => {
		return button
			.setButtonText('登出')
			.setCta()
			.onClick(async () => {
				button.setDisabled(true);
				const loginModel = new DoubanLogoutModel(containerEl, manager);
				await loginModel.doLogout();
				button.setDisabled(false);
				// manager.updateSetting('loginCookiesContent', '');
			});
	});
}

function showMobileLogin(containerEl: HTMLElement, manager: SettingsManager) {
	new Setting(containerEl)
		.setName('豆瓣用户信息')
		.setDesc('豆瓣未登录，请先在电脑端登录！')
}

function showMobileLogout(containerEl: HTMLElement, manager: SettingsManager) {
	new Setting(containerEl)
		.setName('豆瓣用户信息')
		.setDesc('已登录')
		.addButton((button) => {
			return button
				.setButtonText('登出')
				.setCta()
				.onClick(async () => {
					manager.updateSetting('loginCookiesContent', '');
					constructDoubanTokenSettingsUI(containerEl, manager);
				});
		});
}

