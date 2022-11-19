export default class NumberUtil {
	/**
	 * 生成范围随机数
	 * @Min 最小值
	 * @Max 最大值
	 */
	public static getRandomNum(min:number, max:number):number {
		const range = max - min;
		const rand = Math.random();
		return (min + Math.round(rand * range));
	}
}
