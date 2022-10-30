import {i18nHelper} from "../lang/helper";

/**
 * 常量池
 */
export const BasicConst = {
	YAML_FRONT_MATTER_SYMBOL: '---',
	CLEAN_STATUS_BAR_DELAY: 5000,
}

/**
 * 模板类型
 */
export enum TemplateTextMode {
	NORMAL,
	YAML,
}

/**
 * 名称模式
 */
export enum PersonNameMode {
	CH_NAME = "CH",
	EN_NAME = "EN",
	CH_EN_NAME = "CH_EN",
}

/**
 * 名称模式选项
 */
export const PersonNameModeRecords: { [key in PersonNameMode]: string } = {
	[PersonNameMode.CH_NAME]: i18nHelper.getMessage('121206'),
	[PersonNameMode.EN_NAME]: i18nHelper.getMessage('121207'),
	[PersonNameMode.CH_EN_NAME]: i18nHelper.getMessage('121208'),
}

