import {SupportType} from "../../../constant/Constsant";

/**
 * 数组字段长度限制配置
 *
 * 用于限制从豆瓣拉取的内容中数组类型字段（如 actor、director、author 等）
 * 写入笔记时的最大元素数量。
 *
 * 例如: 设置 type=movie, field=actor, limit=5,
 * 则电影的演员列表只会保留前 5 个写入笔记。
 *
 * 当 type=all 时, 限制将作用于所有类型中匹配 field 名称的字段。
 */
export interface ArrayLengthLimit {
	/**
	 * 适用的内容类型 (movie/book/music/teleplay/game/note/theater/all)
	 */
	type: SupportType;
	/**
	 * 字段名 (如 actor, director, author, translator, aliases 等)
	 */
	field: string;
	/**
	 * 最大保留元素数量, <=0 表示不生效
	 */
	limit: number;
}
