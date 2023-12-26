export default class YamlUtil {


	public static hasSpecialChar(str: string): boolean {
		return SPECIAL_CHAR_REG.test(str);
	}


	public static handleSpecialChar(text: string): string {
		// return this.hasSpecialChar(text) ? text.replace(SPECIAL_CHAR_REG, (match, p1) => {
		// 	return SPECIAL_CHAR_REG_REPLACE.get(p1) || p1;
		// }) : text;
		//temp solution
		return '"' + text + '"';
	}

	public static handleText(text: string) {
		return YamlUtil.hasSpecialChar(text)
			? YamlUtil.handleSpecialChar(text.replaceAll('"', '\\"'))
				.replaceAll(/\s+/g,' ')
				.replaceAll('\n', '。')
				.replaceAll('。。', '。')
				.replace(/^" /, '"') // Remove leading "
				.replace(/ "$/, '"') // Remove trailing "
			: text;
	}

}

export const SPECIAL_CHAR_REG = /[{}\[\]&*#?|\-<>=!%@:"`,\n]/;
export const TITLE_ALIASES_SPECIAL_CHAR_REG_G = /[{}\[\]&*#?|\-<>=!%@:"`,， \n]/g;

const SPECIAL_CHAR_REG_REPLACE: Map<string, string> = new Map([
	['{', '\\{'],
]);

