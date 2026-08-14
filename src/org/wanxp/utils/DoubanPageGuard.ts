export enum DoubanPageProblem {
	accessDenied = 'access-denied',
	loginRequired = 'login-required',
}

/**
 * Detects HTML pages that Douban returns with HTTP 200 even though they are
 * not the requested content page. Passing these pages to a subject parser can
 * otherwise create an empty note that looks like a successful import.
 */
export default class DoubanPageGuard {
	static detect(html: string): DoubanPageProblem | null {
		const page = String(html || '');
		if (!page) {
			return null;
		}

		if (/<title[^>]*>\s*禁止访问\s*<\/title>/i.test(page)) {
			return DoubanPageProblem.accessDenied;
		}

		const isLoginRedirectTitle = /<title[^>]*>\s*豆瓣\s*-\s*登录跳转页\s*<\/title>/i.test(page);
		const hasLoginRedirectLink = /accounts\.douban\.com\/passport\/login[^"'<>\s]*redir=/i.test(page);
		if (isLoginRedirectTitle || hasLoginRedirectLink) {
			return DoubanPageProblem.loginRequired;
		}

		return null;
	}
}
