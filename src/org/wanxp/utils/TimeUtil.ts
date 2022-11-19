import NumberUtil from "./NumberUtil";
import {log} from "./Logutil";

export default class TimeUtil {


}



export const sleep = (ms:number)=> {
	return new Promise(resolve=>setTimeout(resolve, ms))
}

export const sleepRange = (msMin: number, msMax:number)=> {
	const msTime = NumberUtil.getRandomNum(msMin, msMax);
	return new Promise(resolve=>setTimeout(resolve, msTime))
}


