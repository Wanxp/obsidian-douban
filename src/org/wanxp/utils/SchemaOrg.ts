import {Person} from "schema-dts";

export default class SchemaOrg {
	public static getPersonName(p: Person): string {
		if (isString(p)) {
			return p;
		} else {
			let name: any = getProperty(p, 'name');
			return name + "";
		}
	}


}

function isString(s: any): s is string {
	return typeof s === 'string';
}


function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
	return o[name];
}


