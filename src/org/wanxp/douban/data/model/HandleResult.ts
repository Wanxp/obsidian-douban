import DoubanSubject from "./DoubanSubject";

export default interface HandleResult {
	content:string
	fileName?:string
	subject?:DoubanSubject,
}
