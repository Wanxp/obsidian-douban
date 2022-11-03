import DoubanSubject from "../model/DoubanSubject";
import HandleContext from "@App/data/model/HandleContext";
import HandleResult from "@App/data/model/HandleResult";

export default interface DoubanSubjectLoadHandler<T extends DoubanSubject> {

	parse(extract: T, context: HandleContext): Promise<HandleResult>;

	support(extract: DoubanSubject): boolean;

	handle(url: string, context: HandleContext): void;


}
