import SettingsManager from "../setting/SettingsManager";
import {RequestUrlParam} from "obsidian";
import {CheerioAPI, load} from "cheerio";
import {log} from "../../utils/Logutil";
import {i18nHelper} from "../../lang/helper";
import User from "./User";
import StringUtil from "../../utils/StringUtil";
import {DEFAULT_SETTINGS} from "../../constant/DefaultSettings";
import {doubanHeaders} from "../../constant/Douban";
import { request } from "https";
import HttpUtil from "../../utils/HttpUtil";
import {DEFAULT_DOUBAN_HEADERS} from "../../constant/Constsant";

export default class UserComponent {
	private settingsManager: SettingsManager;
	private user: User;

	constructor(settingsManager: SettingsManager) {
		this.settingsManager = settingsManager;

	}

	getUser() {
		return this.user;
	}

	getUserId() {
		return this.user?this.user.id:null;
	}


	isLogin() {
		return this.user && this.user.login;
	}

	logout() {
		if (this.user) {
			this.user.login = false;
		}
		this.user = null;
		this.settingsManager.updateSetting('loginCookiesContent', '');
		this.settingsManager.updateSetting('loginHeadersContent', '');

	}



	needLogin() {
		const headers:any = this.settingsManager.getSetting('loginHeadersContent') ;
		const cookies:any = this.settingsManager.getSetting('loginCookiesContent') ;

		if(!headers && !cookies) {
			return false;
		}
		return !this.isLogin();
	}



	async loginHeaders(headers: object):Promise<User> {
		if(!headers) {
			return new User();
		}
		this.settingsManager.debug('配置界面:loginCookie:豆瓣headers信息正常，尝试获取用户信息,headers:' + headers);
		await this.loadUserInfoByHeaders(headers).then(user => {
			this.user = user;
			this.settingsManager.debug(`配置界面:loginCookie:豆瓣headers信息正常，${user&&user.id?'获取用户信息成功id:'+ StringUtil.confuse(user.id) + ',用户名:'+ StringUtil.confuse(user.name) :'获取用户信息失败'}`);
		});
		if(this.user) {
			this.settingsManager.updateSetting('loginHeadersContent', JSON.stringify(headers));
		}
		return this.user;
	}

	async loadUserInfoByHeaders(headers: object): Promise<User> {
		return HttpUtil.httpRequestGet('https://www.douban.com/mine/', headers, this.settingsManager)
			.then(load)
			.then(this.getUserInfo);
	}

	async loginCookie(cookie: any):Promise<User> {
		const headers: object = this.settingsManager.getHeadersByCookie(cookie);
		return this.loginHeaders(headers)
			.then(user => {
				if(this.user) {
					this.settingsManager.updateSetting('loginCookiesContent', cookie);
				}
				return user;
			});
	}


	 async loadUserInfo(cookie: any): Promise<User> {
		 const headers1 = {
			 ...DEFAULT_DOUBAN_HEADERS,
			 Cookie: cookie
		 }
		return HttpUtil.httpRequestGet('https://www.douban.com/mine/', headers1, this.settingsManager)
			.then(load)
			.then(this.getUserInfo);
	};


	private getUserInfo(dataHtml: CheerioAPI): User {
		let elements = dataHtml("#db-usr-profile > div.pic > a");
		if (!elements) {
			return new User();
		}
		let name = dataHtml(dataHtml("head > title").get(0)).text().trim();
		let userUrl = dataHtml(elements.get(0)).attr("href");
		if (!name && !userUrl) {
			return new User();
		}
		let id = '';
		if (userUrl && userUrl.indexOf('people/') > 0) {
			id = userUrl.substring(userUrl.lastIndexOf('people/') + 7, userUrl.lastIndexOf('/'));
		}
		if (!id) {
			return new User();
		}
		return {
			id: id,
			name: name,
			url: userUrl,
			login: true
		};
	};


	async login() {
		let headers:object = this.settingsManager.getHeaders();
		if(!headers) {
			this.settingsManager.debug('主界面:login:无豆瓣信息，获取用户信息失败');
			return new User();
		}
		this.settingsManager.debug('主界面:login:豆瓣headers信息正常，尝试获取用户信息');
		await this.loadUserInfoByHeaders(headers).then(user => {
			this.user = user;
			this.settingsManager.debug(`主界面:loginByCookie:豆瓣cookies信息正常，${user&&user.id?'获取用户信息成功id:'+ StringUtil.confuse(user.id) + ',用户名:'+ StringUtil.confuse(user.name) :'获取用户信息失败'}`);
		});
		return this.user;
	}
}
