import {AbstractSearchPageFetcher} from "./AbstractSearchPageFetcher";
import { SupportType } from "src/org/wanxp/constant/Constsant";

export class MoviePageSearchPageFetcher extends AbstractSearchPageFetcher  {
    getUrl(keyword: string, pageNum: number, pageSize: number): string {
       return  `https://www.douban.com/j/search?q=${keyword}&start=${pageNum * pageSize}&cat=1002`;
    }
    support(type: SupportType): boolean {
		return type == SupportType.MOVIE;
    }


}
