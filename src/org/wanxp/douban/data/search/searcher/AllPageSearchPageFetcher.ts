import {AbstractSearchPageFetcher} from "./AbstractSearchPageFetcher";
import { SupportType } from "src/org/wanxp/constant/Constsant";

export class AllPageSearchPageFetcher extends AbstractSearchPageFetcher  {
    getUrl(keyword: string, pageNum: number, pageSize: number): string {
       return  `https://m.douban.com/rexxar/api/v2/search?q=${keyword}&start=${pageNum}&count=${pageSize}`;
    }
    support(type: SupportType): boolean {
		return type == SupportType.all;
    }


}
