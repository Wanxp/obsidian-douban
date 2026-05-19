import {ButtonComponent, DropdownComponent, Setting, TextComponent} from "obsidian";
import SettingsManager from "./SettingsManager";
import {i18nHelper} from "../../lang/helper";
import {SupportType, SupportTypeMap} from "../../constant/Constsant";
import {ArrayLengthLimit} from "./model/ArrayLengthLimit";

/**
 * "数组字段长度限制" 设置页签构造器。
 *
 * 允许用户为指定的内容类型(电影/电视剧/书籍/音乐/游戏/笔记/戏剧/全部)中的数组字段
 * (如 actor/director/author/translator/aliases/...) 自定义最大保留数量。
 */
export function constructArrayLengthLimitSettingsUI(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.createEl('p', {text: i18nHelper.getMessage('1271')});
	containerEl.createEl('p', {text: i18nHelper.getMessage('1272')});

	if (!manager.plugin.settings.arrayLengthLimits) {
		manager.plugin.settings.arrayLengthLimits = [];
	}
	const limits = manager.plugin.settings.arrayLengthLimits;

	new Setting(containerEl)
		.setDesc(i18nHelper.getMessage('1273'))
		.addButton((button) => {
			button.setButtonText(i18nHelper.getMessage('124101'));
			button.setTooltip(i18nHelper.getMessage('127401'));
			button.setIcon('plus');
			button.onClick(async () => {
				await manager.addArrayLengthLimit();
				renderItems(list, manager);
			});
		});

	const list = containerEl.createDiv('array-length-limit-list');
	renderItems(list, manager);
}

function renderItems(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.empty();
	const limits = manager.plugin.settings.arrayLengthLimits || [];
	for (let i = 0; i < limits.length; i++) {
		buildItem(containerEl, manager, limits, i);
	}
}

function buildItem(containerEl: HTMLElement, manager: SettingsManager, limits: ArrayLengthLimit[], idx: number) {
	const data = limits[idx];

	const item = containerEl.createEl('li');

	// 适用类型
	item.createEl('span', {text: i18nHelper.getMessage('127402')});
	const typeDropdown = new DropdownComponent(item);
	for (const fieldSelect in SupportType) {
		typeDropdown.addOption(fieldSelect, i18nHelper.getMessage(fieldSelect));
	}
	let dataTypeValue = data.type;
	if (typeof dataTypeValue === 'string') {
		// @ts-ignore
		dataTypeValue = SupportTypeMap[dataTypeValue] || SupportType.all;
	}
	typeDropdown.setValue(dataTypeValue || SupportType.all)
		.onChange(async (value: SupportType) => {
			limits[idx].type = value;
			await manager.plugin.saveSettings();
		});
	const typeEl = typeDropdown.selectEl;
	typeEl.addClass('obsidian_douban_settings_input');
	item.appendChild(typeEl);

	// 字段名
	item.createEl('span', {text: i18nHelper.getMessage('127403')});
	const fieldField = new TextComponent(item);
	fieldField.setPlaceholder(i18nHelper.getMessage('127404'))
		.setValue(data.field || '')
		.onChange(async (value) => {
			limits[idx].field = (value || '').trim();
			await manager.plugin.saveSettings();
		});
	const fieldEl = fieldField.inputEl;
	fieldEl.addClass('obsidian_douban_settings_input');
	item.appendChild(fieldEl);

	// 最大数量
	item.createEl('span', {text: i18nHelper.getMessage('127405')});
	const limitField = new TextComponent(item);
	limitField.setPlaceholder(i18nHelper.getMessage('127406'))
		.setValue(data.limit != null ? String(data.limit) : '')
		.onChange(async (value) => {
			const parsed = parseInt(value, 10);
			if (Number.isNaN(parsed) || parsed < 0) {
				// 无效输入忽略, 保持原值
				return;
			}
			limits[idx].limit = parsed;
			await manager.plugin.saveSettings();
		});
	const limitEl = limitField.inputEl;
	limitEl.type = 'number';
	limitEl.min = '0';
	limitEl.addClass('obsidian_douban_settings_input');
	item.appendChild(limitEl);

	// 删除按钮
	const removeBtn = new ButtonComponent(item);
	removeBtn.setIcon('minus-with-circle');
	removeBtn.setTooltip(i18nHelper.getMessage('127407'));
	removeBtn.onClick(async () => {
		await manager.removeArrayLengthLimit(idx);
		renderItems(containerEl, manager);
	});
	const removeBtnEl = removeBtn.buttonEl;
	removeBtnEl.addClass('obsidian_douban_settings_button');
	item.appendChild(removeBtnEl);
}
