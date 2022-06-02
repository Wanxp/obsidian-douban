import DoubanSubject from "douban/model/DoubanSubject";
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";

export default class DoubanOtherLoadHandler extends DoubanAbstractLoadHandler<DoubanSubject> {
    getSubject(): DoubanSubject {
        throw new Error("Method not implemented.");
    }
    getTextResult(): string {
        throw new Error("Method not implemented.");
    }
    getType(): string {
        return undefined;
    }



}