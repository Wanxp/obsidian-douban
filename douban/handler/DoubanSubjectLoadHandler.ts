import DoubanSubject from "douban/model/DoubanSubject";

export default interface DoubanSubjectLoadHandler<T extends DoubanSubject> {

    getType():string | undefined;

    support(extract:DoubanSubject):boolean;

    handle(url:string):void;


}