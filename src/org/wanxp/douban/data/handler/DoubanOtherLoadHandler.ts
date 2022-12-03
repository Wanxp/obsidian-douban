import {CheerioAPI} from "cheerio";
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanSubject from "../model/DoubanSubject";
import {i18nHelper} from "src/org/wanxp/lang/helper";
import {log} from "src/org/wanxp/utils/Logutil";
import HandleContext from "../model/HandleContext";
import {SupportType, TemplateKey} from "../../../constant/Constsant";
import {UserStateSubject} from "../model/UserStateSubject";

/**
 * 默认的处理器
 */
export default class DoubanOtherLoadHandler extends DoubanAbstractLoadHandler<DoubanSubject> {
	getSupportType(): SupportType.ALL {
		return SupportType.ALL;
	}

	parseText(beforeContent: string, extract: DoubanSubject, context: HandleContext): string {
		log.warn(i18nHelper.getMessage('140101'));
		return "";
	}

	support(extract: DoubanSubject): boolean {
		return false;
	}

	getHighQuantityImageUrl(fileName:string):string{
		return `https://img9.doubanio.com/view/photo/l/public/${fileName}`;
	}

	parseSubjectFromHtml(data: CheerioAPI, context: HandleContext): DoubanSubject {
		return undefined;
	}

	analysisUser(html: CheerioAPI, context: HandleContext): { data: CheerioAPI; userState: UserStateSubject } {
		return {data: undefined, userState: undefined};
	}


}
