export class LoginUtil {

	static contentNeedLogin(content:string):boolean {
		return content &&  content.indexOf("你要的东西不在这, 到别处看看吧。") > -1;
	}
}
