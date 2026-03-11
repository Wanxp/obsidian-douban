import {AbstractSearchPageFetcher} from "./AbstractSearchPageFetcher";
import { SupportType } from "src/org/wanxp/constant/Constsant";

export class AllPageSearchPageFetcher extends AbstractSearchPageFetcher  {
    getUrl(keyword: string, start: number, pageSize: number): string {
       return  `https://www.douban.com/j/search?q=${keyword}&start=${start}`;
    }
    support(type: SupportType): boolean {
		return type == SupportType.all;
    }


}
