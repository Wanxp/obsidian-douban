import DoubanSubject from "douban/model/DoubanSubject";

export default interface DoubanSubjectLoadHandler<T extends DoubanSubject> {

    getType():string;

    support(extract:DoubanSubject):boolean;

    getSubject(url:string):T;

    getTextResult(url:string):string;

}