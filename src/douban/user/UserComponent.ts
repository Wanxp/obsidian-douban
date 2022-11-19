import SettingsManager from "@App/setting/SettingsManager";
import {DoubanPluginSetting} from "@App/setting/model/DoubanPluginSetting";
import DoubanSearchResultSubject from "@App/data/model/DoubanSearchResultSubject";
import {request, RequestUrlParam} from "obsidian";
import {DEFAULT_SETTINGS} from "../../constant/DefaultSettings";
import {CheerioAPI, load} from "cheerio";
import SearchParserHandler from "@App/data/search/SearchParser";
import {log} from "../../utils/Logutil";
import {i18nHelper} from "../../lang/helper";
import User from "@App/user/User";
import DoubanGameSubject from "@App/data/model/DoubanGameSubject";

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
	}



	needLogin() {
		const cookie:any = this.settingsManager.getSetting('loginCookiesContent') ;
		if(!cookie) {
			return false;
		}
		return !this.isLogin();
	}

	async loginByCookie():Promise<User> {
		let cookie = this.settingsManager.getSetting('loginCookiesContent');
		if(!cookie) {
			return new User();
		}
		await this.loadUserInfo(cookie).then(user => {
			this.user = user;
		});
		return this.user;
	}

	async loginCookie(cookie: any):Promise<User> {
		if(!cookie) {
			return new User();
		}
		await this.loadUserInfo(cookie).then(user => {
			this.user = user;
		});
		this.settingsManager.updateSetting('loginCookiesContent', cookie);
		return this.user;
	}

	 async loadUserInfo(cookie: any): Promise<User> {
		let requestUrlParam: RequestUrlParam = {
			url: 'https://www.douban.com/mine/',
			method: "GET",
			headers: {'Cookie': cookie},
			throw: true
		};
		return request(requestUrlParam)
			.then(load)
			.then(this.getUserInfo)
			.catch(e => log.error(i18nHelper.getMessage('130101').replace('{0}',   e.toString()), e));
			;
	};


	private getUserInfo(dataHtml: CheerioAPI): User {
		let elements = dataHtml("#db-usr-profile > div.pic > a");
		if (!elements) {
			return new User();
		}
		let name = dataHtml(dataHtml("head > title").get(0)).text().trim();
		let userUrl = dataHtml(elements.get(0)).attr("href");
		let idPattern = /(\d){5,10}/g;
		let idP = idPattern.exec(userUrl);
		let id = idP ? idP[0] : "";
		if (!id) {
			return new User();
		}
		const result: User = {
			id: id,
			name: name,
			url: userUrl,
			login: true
		}
		return result;

	};

}
