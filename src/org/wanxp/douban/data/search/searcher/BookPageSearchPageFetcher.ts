import {AbstractSearchPageFetcher} from "./AbstractSearchPageFetcher";
import { SupportType } from "src/org/wanxp/constant/Constsant";

export class BookPageSearchPageFetcher extends AbstractSearchPageFetcher  {
    getUrl(keyword: string, pageNum: number, pageSize: number): string {
       return  `https://www.douban.com/j/search?q=${keyword}&start=${pageNum * pageSize}&cat=1001`;
    }
    support(type: SupportType): boolean {
		return type == SupportType.MOVIE;
    }


}
