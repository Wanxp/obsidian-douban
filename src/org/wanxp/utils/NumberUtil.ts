import {DEFAULT_SETTINGS} from "../constant/DefaultSettings";
import {ScoreSetting} from "../douban/setting/model/ScoreSetting";

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

	/**
	 *
	 * @param rate 评分
	 * @param rateMax 最大评分
	 * @param rateStarMax 最大星星数
	 * @param options 配置
	 */
	static getRateStar(rate: number, rateMax: number, options?:{scoreSetting?:ScoreSetting}):string {
		if (rate > rateMax) {
			this.getRateStarMaxRate(1,  options);
		}
		return this.getRateStarMaxRate(rate / rateMax,  options);

	}

	/**
	 * 输出星星数和评分
	 * @param rate 小数 评分[0 - 1]
	 * @param rateStarMax 最大星星数
	 * @param options 配置
	 */
	private static getRateStarMaxRate(star: number, options?:{scoreSetting?:ScoreSetting}):string {
		let result = '';
		const scoreSetting = options&&options.scoreSetting?options.scoreSetting:DEFAULT_SETTINGS.scoreSetting;
		const starFull = scoreSetting&&scoreSetting.starFull?scoreSetting.starFull: '★';
		const starEmpty = scoreSetting&&scoreSetting.starEmpty?scoreSetting.starEmpty: '☆';
		const displayStarEmpty =scoreSetting&&(scoreSetting.displayStarEmpty != null)?scoreSetting.displayStarEmpty:true;
		const rateStarMax =scoreSetting&&scoreSetting.maxStar?scoreSetting.maxStar:5;

		star = Math.floor(star * rateStarMax);
		for (let i = 0; i < rateStarMax; i++) {
			if (i < star) {
				result += starFull;
			} else if (displayStarEmpty) {
				result += starEmpty;
			}
		}
		return result;
	}

	static isNumber(value: string) {
		return !isNaN(Number(value));
	}

	static isInt(value: string) {
		return Number.isInteger(Number(value));
	}

	static value(value: string) {
		return Number(value);
	}
}
