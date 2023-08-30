import SettingsManager from "../setting/SettingsManager";
import {request, RequestUrlParam} from "obsidian";
import {CheerioAPI, load} from "cheerio";
import {log} from "../../utils/Logutil";
import {i18nHelper} from "../../lang/helper";
import User from "./User";
import StringUtil from "../../utils/StringUtil";
import {DEFAULT_SETTINGS} from "../../constant/DefaultSettings";
import {doubanHeaders} from "../../constant/Douban";

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
			this.settingsManager.debug('主界面:loginByCookie:无豆瓣cookies信息，获取用户信息失败');
			return new User();
		}
		this.settingsManager.debug('主界面:loginByCookie:豆瓣cookies信息正常，尝试获取用户信息');
		await this.loadUserInfo(cookie).then(user => {
			this.user = user;
			this.settingsManager.debug(`主界面:loginByCookie:豆瓣cookies信息正常，${user&&user.id?'获取用户信息成功id:'+ StringUtil.confuse(user.id) + ',用户名:'+ StringUtil.confuse(user.name) :'获取用户信息失败'}`);
		});
		return this.user;
	}

	async loginCookie(cookie: any):Promise<User> {
		if(!cookie) {
			return new User();
		}
		this.settingsManager.debug('配置界面:loginCookie:豆瓣cookies信息正常，尝试获取用户信息');
		await this.loadUserInfo(cookie).then(user => {
			this.user = user;
			this.settingsManager.debug(`配置界面:loginCookie:豆瓣cookies信息正常，${user&&user.id?'获取用户信息成功id:'+ StringUtil.confuse(user.id) + ',用户名:'+ StringUtil.confuse(user.name) :'获取用户信息失败'}`);
		});
		if(this.user) {
			this.settingsManager.updateSetting('loginCookiesContent', cookie);
		}
		return this.user;
	}


	 async loadUserInfo(cookie: any): Promise<User> {
		const headers1 = {
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
			'Accept-Language': 'zh-CN,zh;q=0.9',
			'Cookie': 'll="118254"; bid=e3SJhuRaDoQ; _pk_id.100001.8cb4=0b044d4d91fdda7d.1689002992.; ap_v=0,6.0; __yadk_uid=7Eg5yv2X4YarGEeH16Tm4fYL49PdGNcN; push_noty_num=0; push_doumail_num=0; __utmv=30149280.16378; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1689007676%2C%22https%3A%2F%2Fwww.google.com%2F%22%5D; _pk_ses.100001.8cb4=1; __utma=30149280.2026487677.1689002992.1689002992.1689007676.2; __utmc=30149280; __utmz=30149280.1689007676.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __utmt=1; dbcl2="163783265:gitjSogzBf4"; ck=-hBQ; __gads=ID=df3cc2947f6dddaa-2255abc9a2e200c3:T=1689004292:RT=1689007691:S=ALNI_MZZ0HVSzWxK28Qd8yN2KGJNkdthHA; __gpi=UID=00000c1f8aeb6832:T=1689004292:RT=1689007691:S=ALNI_MYsS7sKea87clnkc-vWGArdV8O6gQ; __utmb=30149280.7.10.1689007676',
			'Referer': 'https://accounts.douban.com/',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
		}
	 	// Object.assign(headers, doubanHeaders, {'Cookie': cookie}, {'Referer': 'https://accounts.douban.com/'})
		let requestUrlParam: RequestUrlParam = {
			url: 'https://www.douban.com/mine/',
			method: "GET",
			headers: headers1,
			throw: true
		};
		 this.settingsManager.debug('loadUserInfo:尝试获取用户信息:https://www.douban.com/mine/');
		 return request(requestUrlParam)
			 .then(requestUrlResponse => {
				 if (requestUrlResponse.indexOf('https://sec.douban.com/a') > 0) {
					 this.settingsManager.debug(`loadUserInfo:登录Douban获取异常网页如下:\n${requestUrlResponse}`);
					 throw new Error(i18nHelper.getMessage('130105'));
				 }
				 this.settingsManager.debug(`loadUserInfo:登录Douban获取网页如下:\n${requestUrlResponse}`);
				 return requestUrlResponse;
			 })
			.then(load)
			.then(this.getUserInfo)
			.catch(e =>  {
				if(e.toString().indexOf('403') > 0) {
					throw new Error(i18nHelper.getMessage('130105'));
				}else {
					throw log.error(i18nHelper.getMessage('130101').replace('{0}',   e.toString()), e)
				}
			});
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

}
