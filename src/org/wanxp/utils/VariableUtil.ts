import SettingsManager from "../douban/setting/SettingsManager";
import {ArraySetting, DEFAULT_SETTINGS_ARRAY_NAME} from "../douban/setting/model/ArraySetting";
import StringUtil from "./StringUtil";
import YamlUtil from "./YamlUtil";
import {log} from "./Logutil";
import {i18nHelper} from "../lang/helper";
import {DataValueType, SupportType} from "../constant/Constsant";
import {DataField} from "./model/DataField";
import {FieldVariable} from "./model/FieldVariable";
import {CustomProperty} from "../douban/setting/model/CustomProperty";

export class VariableUtil {

	/**

	 *
	 * @param obj
	 * @param content
	 * @param settingManager
	 */

	static replaceSubject(obj: any, content: string, subjectType: SupportType, settingManager:SettingsManager): string {
		if (!content || !obj) {
			return content;
		}
		const allVariables = this.getAllVariables(content, settingManager);
		if (!allVariables || allVariables.length == 0) {
			return content;
		}
		if (obj instanceof Map) {
			this.handleCustomVariable(subjectType, obj, settingManager)
			content = this.replaceMap(obj, allVariables, content, settingManager);
		}else {
			const map = this.objToMap(obj);
			this.handleCustomVariable(subjectType, map, settingManager)
			content = this.replaceMap(map, allVariables, content, settingManager);
		}
		return content;
	}

	/**

	 *
	 * @param obj
	 * @param content
	 * @param settingManager
	 */

	static replace(obj: any, content: string, settingManager:SettingsManager): string {
		if (!content || !obj) {
			return content;
		}
		const allVariables = this.getAllVariables(content, settingManager);
		if (!allVariables || allVariables.length == 0) {
			return content;
		}
		if (obj instanceof Map) {
			content = this.replaceMap(obj, allVariables, content, settingManager);
		}else {
			const map = this.objToMap(obj);
			content = this.replaceMap(map, allVariables, content, settingManager);		}

		return content;
	}

	/**
	 * <h3>type</h3>
	 * <li>Number</li>
	 * <li>String</li>
	 * <li>Array</li>
	 *
	 * <h3>name</h3>
	 * <li> aliases</li>
	 * @param variable
	 * @param value
	 * @param content
	 * @param settingManager
	 */
	static replaceVariable(variable: FieldVariable, value: any, content: string, settingManager:SettingsManager): string {
		if (!content) {
			return content;
		}
		//根据value的类型，替换对应的变量
		if (value instanceof Array) {
			content = this.replaceArray(variable, value, content, settingManager);
		} else if(value instanceof DataField) {
			content = this.replaceDataField(variable, value, content, settingManager);
		} else {
			content = this.replaceString(variable, value, content, settingManager);
		}
		return content;
	}

	static replaceArray(variable: FieldVariable, value: any[], content: string, settingManager:SettingsManager): string {
		if (!content) {
			return content;
		}
		const variableStr = variable.variable;
		const outTypeName = variable.outTypeName;
		if (!value) {
			return content.replaceAll(variableStr, "");
		}
		const arraySettings = this.getArraySetting(outTypeName, settingManager);
		if (!arraySettings) {
			log.warn(i18nHelper.getMessage(`130107`, variable.variable, outTypeName));
			return content;
		}

		const strValues:string[] = value.map((v) => {
			if (typeof v === 'string') {
				return v;
			} else {
				return v?v.toString() : null;
			}
		})
			.filter(v => v)
			.map(v => YamlUtil.handleText(v))
		;
		const arrayValue = StringUtil.handleArray(strValues, arraySettings);
		content = content.replaceAll(variableStr, arrayValue);
		return content;
	}

	static keyToVariable(key: string): string {
		return `{{${key}}}`;
	}

	static replaceString(variable: FieldVariable, value: any, content: string, settingManager:SettingsManager): string {
		if (!content) {
			return content;
		}
		let strValue = value?  value.toString() : "";
		strValue = YamlUtil.handleText(strValue);
		return content.replaceAll(variable.variable, strValue);
	}

	/**
	 * 从key中提取 arrayName, 然后从settings中获取对应的ArraySetting
	 * @param key
	 * @private
	 */
	private static getAllVariables(content: string, settingManager:SettingsManager): FieldVariable[] {
		const reg =/\{\{[a-zA-Z-0-9_.]+([(a-zA-Z-0-9)]+)?}}/g
		const result = content.match(reg);
		if (!result) {
			return [];
		}
		return result.map((v) => {
			const reg2 = new RegExp(`[a-zA-Z-0-9_.]+`, 'g');
			const result2 = v.match(reg2);
			if (!result2) {
				return null;
			}
			if (result2.length == 1) {
				return new FieldVariable(result2[0],  v,  null);
			}
			return new FieldVariable(result2[0], v, result2[1]);
		}).filter(v => v);
	}

	/**
	 * 从key中提取 arrayName, 然后从settings中获取对应的ArraySetting
	 * @param outTypeName
	 * @private
	 */
	private static getArraySetting(outTypeName: string, settingManager:SettingsManager): ArraySetting {
		if (!outTypeName) {
			return settingManager.getArraySetting(DEFAULT_SETTINGS_ARRAY_NAME);
		} else {
			return settingManager.getArraySetting(outTypeName);
		}
	}


	private static replaceMap(obj: Map<string, any>, allVariables:FieldVariable[], content: string, settingManager: SettingsManager) {
		allVariables.forEach(variable => {
			const value = obj.get(variable.key);
			content = this.replaceVariable(variable, value,content, settingManager);
		});
		return content;
	}

	static getType(value: any):DataValueType {
		if (typeof value === 'number') {
			return DataValueType.number;
		} else if (typeof value === 'string') {
			if (value.startsWith('http://') || value.startsWith('https://')) {
				return DataValueType.url;
			}else if (/^(\/|\.\/|\.\.\/|~\/|.*\.[a-zA-Z0-9]+$)/.test(value)) {
				return DataValueType.path;
			}
			return DataValueType.string;
		} else if (value instanceof Date) {
			return DataValueType.date;
		} else if (value instanceof Array) {
			return DataValueType.array;
		} else {
			return DataValueType.string;
		}
	}

	private static replaceDataField(variable: FieldVariable, value: DataField, content: string, settingManager: SettingsManager) {
		if (!content) {
			return content;
		}
		const variableStr = variable.variable;
		if (!value) {
			return content.replaceAll(variableStr, "");
		}
		switch (value.type) {
			case DataValueType.string:
				content = this.replaceString(variable, value.value, content, settingManager);
				break;
			case DataValueType.number:
				content = content.replaceAll(variableStr, value.value.toString());
				break;
			case DataValueType.date:
				content = content.replaceAll(variableStr, value.value);
				break;
			case DataValueType.array:
				content = this.replaceArray(variable, value.value, content, settingManager);
				break;
			default:
				content = content.replaceAll(variableStr, value.value);
				break;

		}

		return content;
	}

	/**
	 * 处理自定义参数
	 * @param template
	 * @param context
	 * @private
	 */
	static handleCustomVariable(subjectType: SupportType, variableMap:Map<string, DataField>, settingMananger: SettingsManager): void {
		// @ts-ignore
		const customProperties: CustomProperty[] = settingMananger.getSetting('customProperties');
		if (!customProperties) {
			return ;
		}
		const customPropertiesMap= new Map();
		customProperties.filter(customProperty => customProperty.name &&
			customProperty.field
			&& (customProperty.field.toLowerCase() == SupportType.ALL ||
				customProperty.field.toLowerCase() == subjectType)).forEach(customProperty => {
			customPropertiesMap.set(customProperty.name, customProperty.value);
		});
		customPropertiesMap.forEach((value, key) => {
			variableMap.set(key,
				new DataField(
					key, DataValueType.string, value,
					VariableUtil.replace(variableMap, value, settingMananger)));
		})
	}

	private static objToMap(obj: any):Map<string, any> {
		const map = new Map<string, any>();
		Object.keys(obj).forEach(key => {
			map.set(key, obj[key]);
		});
		return map;
	}
}
