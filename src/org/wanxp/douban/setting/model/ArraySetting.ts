export interface ArraySetting {
	index: number;
	arrayName: string;
	arrayStart: string;
	arrayElementStart: string;
	arraySpiltV2: string;
	arrayElementEnd: string;
	arrayEnd: string;
}

export enum ArraySettingFieldName {
	index = "index",
	arrayName = "arrayName",
	arrayStart = "arrayStart",
	arrayElementStart = "arrayElementStart",
	arraySpiltV2 = "arraySpiltV2",
	arrayElementEnd = "arrayElementEnd",
	arrayEnd = "arrayEnd",
}

export const DEFAULT_SETTINGS_ARRAY_NAME = "default";
export const ARRAY_NAME_PREFIX_NAME = "ArrayType";
