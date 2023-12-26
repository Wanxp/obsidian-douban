import NumberUtil from "./NumberUtil";
import {BasicConst, ESTIMATE_TIME_PER_WITH_REQUEST, ESTIMATE_TIME_PER_WITH_REQUEST_SLOW} from "../constant/Constsant";
import {i18nHelper} from "../lang/helper";

export default class TimeUtil {


	/**
	 * 计算预估需要的时间
	 * @param needHandled 需要处理的数量
	 * @param overSlowSize 是否超过慢速长度的阈值
	 * @return 需要耗费的毫秒数
	 */
	public static estimateTime(needHandled:number, overSlowSize:boolean):number {
		if (needHandled <= 0) {
            return 0;
        }
		let times = 0;
		if (overSlowSize) {
			if (needHandled <= BasicConst.SLOW_SIZE) {
				times = ESTIMATE_TIME_PER_WITH_REQUEST * needHandled;
			}else {
				times = ESTIMATE_TIME_PER_WITH_REQUEST * BasicConst.SLOW_SIZE +  ESTIMATE_TIME_PER_WITH_REQUEST_SLOW * Math.max(needHandled - BasicConst.SLOW_SIZE, 0);
			}
		}else {
			times = ESTIMATE_TIME_PER_WITH_REQUEST * needHandled;
		}
		return times;
	}

	public static estimateTimeMsg(needHandled:number, overSlowSize:boolean):string {
		const times:number = this.estimateTime(needHandled, overSlowSize);
		if (times <= 0) {
            return 0+i18nHelper.getMessage('SECOND');
        }
		return this.formatDuring(times);
	}

	public static formatDuring(mss:number):string {
		let show:boolean = false;
		let message:string = "";
		const days = Math.floor(mss / (1000 * 60 * 60 * 24));
		const hours = Math.floor((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((mss % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((mss % (1000 * 60)) / 1000);

		if (days > 0) {
			show = true;
			message += days + i18nHelper.getMessage("DAY");
		}
		if (hours > 0 || show) {
			show = true;
			message += hours + i18nHelper.getMessage("HOUR");
		}
		if (minutes > 0 || show) {
			show = true;
			message += minutes + i18nHelper.getMessage("MINUTE");
		}
		if (seconds > 0 || show) {
			message += seconds + i18nHelper.getMessage("SECOND");
		}
		return message;
	}



}



export const sleep = (ms:number)=> {
	return new Promise(resolve=>setTimeout(resolve, ms))
}

export const sleepRange = (msMin: number, msMax:number)=> {
	const msTime = NumberUtil.getRandomNum(msMin, msMax);
	return new Promise(resolve=>setTimeout(resolve, msTime))
}


