import {AbstractSearchPageFetcher} from "./AbstractSearchPageFetcher";
import { SupportType } from "src/org/wanxp/constant/Constsant";

export class NotePageSearchPageFetcher extends AbstractSearchPageFetcher  {
    getUrl(keyword: string, start: number, pageSize: number): string {
       return  `https://www.douban.com/j/search?q=${keyword}&start=${start}&cat=1015`;
    }
	support(type: SupportType, pageNum:number): boolean {
		return type == SupportType.note && pageNum > 1;
	}




}
