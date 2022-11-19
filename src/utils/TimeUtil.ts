import NumberUtil from "./NumberUtil";

export default class TimeUtil {
	public static async delay(callback: Function,  ms: number):Promise<any> {
		return await new Promise(resolve => setTimeout(() => callback, ms));
	}

	public static async delayRange(callback: Function,  msMin: number, msMax:number):Promise<any> {
		return await new Promise(resolve => setTimeout(() => callback, NumberUtil.getRandomNum(msMin, msMax)));
	}


}
