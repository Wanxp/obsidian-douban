import DoubanSubject from "./DoubanSubject";

export default interface HandleResult {
	content:string
	filePath?:string
	fileName?:string
	subject?:DoubanSubject,
}
