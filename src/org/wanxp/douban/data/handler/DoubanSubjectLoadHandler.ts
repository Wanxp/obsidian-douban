import DoubanSubject from "../model/DoubanSubject";
import HandleContext from "../model/HandleContext";
import HandleResult from "../model/HandleResult";

export default interface DoubanSubjectLoadHandler<T extends DoubanSubject> {

	parse(extract: T, context: HandleContext): Promise<HandleResult>;

	support(extract: DoubanSubject): boolean;

	handle(id: string, context: HandleContext): Promise<T>;

}
