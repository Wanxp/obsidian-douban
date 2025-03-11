import {AbstractSearchPageFetcher} from "./AbstractSearchPageFetcher";
import { SupportType } from "src/org/wanxp/constant/Constsant";

export class NoteFirstPageSearchPageFetcher extends AbstractSearchPageFetcher  {
    getUrl(keyword: string, start: number, pageSize: number): string {
       return  `https://www.douban.com/search?cat=1015&q=${keyword}`;
    }
    support(type: SupportType, pageNum:number): boolean {
		return type == SupportType.note && pageNum == 1;
    }


}
