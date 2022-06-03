import { CheerioAPI } from "cheerio";
import DoubanSubject from "douban/model/DoubanSubject";
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";

export default class DoubanOtherLoadHandler extends DoubanAbstractLoadHandler<DoubanSubject> {
    parseSubjectFromHtml(data: CheerioAPI): DoubanSubject | undefined{
        return undefined;
    }
    getType(): string | undefined{
        return undefined
    }




}