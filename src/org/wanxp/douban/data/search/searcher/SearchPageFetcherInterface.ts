import {SupportType} from "../../../../constant/Constsant";

export interface SearchPageFetcherInterface {

	support(type:SupportType):boolean;

	fetch(keyword:string, pageNum:number, pageSize:number):Promise<string>;

}
