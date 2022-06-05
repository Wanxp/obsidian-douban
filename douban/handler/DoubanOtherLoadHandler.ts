import { Editor, Notice } from "obsidian";

import { CheerioAPI } from "cheerio";
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanSubject from "douban/model/DoubanSubject";
import { i18nHelper } from "lang/helper";
import { log } from "utils/logutil";

/**
 * 默认的处理器
 */
export default class DoubanOtherLoadHandler extends DoubanAbstractLoadHandler<DoubanSubject> {
    parseText(template: string, arraySpilt: string, extract: DoubanSubject): string {
       log.warn(i18nHelper.getMessage('current version not support type'));
       return "";
    }
    support(extract: DoubanSubject): boolean {
        return false;
    }
    parseSubjectFromHtml(data: CheerioAPI): DoubanSubject {
       return undefined;
    }





}