import {i18nHelper} from "../../lang/helper";
import {Setting, TextComponent, ToggleComponent} from "obsidian";
import {createFolderSelectionSetting, createFolderSelectionSettingInput} from "./TemplateSettingHelper";
import {DEFAULT_SETTINGS} from "../../constant/DefaultSettings";
import {
	DEFAULT_SETTINGS_ARRAY_INPUT_SIZE, EXAMPLE_RATE, EXAMPLE_RATE_MAX,
	EXAMPLE_SUBJECT_MAP, MAX_STAR_NUMBER,
	PersonNameMode,
	PersonNameModeRecords, PictureBedSetting_PicGo, PictureBedType, PictureBedTypeRecords,
	SupportType
} from "../../constant/Constsant";
import SettingsManager from "./SettingsManager";
import NumberUtil from "../../utils/NumberUtil";
import {VariableUtil} from "../../utils/VariableUtil";
import {FileUtil} from "../../utils/FileUtil";
import {ScoreSetting} from "./model/ScoreSetting";
import DoubanPlugin from "../../main";


function showStarExample(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.empty();
	const document = new DocumentFragment();
	document.createDiv('score-show-title')
		.innerHTML = `score: ${NumberUtil.getRateStar(EXAMPLE_RATE, EXAMPLE_RATE_MAX, {scoreSetting: manager.plugin.settings.scoreSetting})}`;

	new Setting(containerEl)
		.setName(i18nHelper.getMessage('120603'))
		.setDesc(document);
}

export function showFileExample(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.empty();
	const document = new DocumentFragment();
	document.createDiv('file-path-example')
		.innerHTML = `${i18nHelper.getMessage('121604')}<a href="https://book.douban.com/subject/2253379/">《简爱》</a>: ${VariableUtil.replaceSubject(EXAMPLE_SUBJECT_MAP, 
		FileUtil.join(manager.plugin.settings.dataFilePath, manager.plugin.settings.dataFileNamePath + ".md"), SupportType.book, 
		manager, 'path')}`;

	new Setting(containerEl)
		.setName(i18nHelper.getMessage('120603'))
		.setDesc(document);
}

function scoreSettingDisplay(containerEl: HTMLElement, manager: SettingsManager) {
	new Setting(containerEl)
		.setName(i18nHelper.getMessage('1243'))
		.setDesc(i18nHelper.getMessage('124310', EXAMPLE_RATE, EXAMPLE_RATE_MAX));
	const scoreSettingsUI = containerEl.createDiv('score-settings');
	const scoreShowUI = containerEl.createDiv('score-show');

	//@ts-ignore1·
	const scoreSetting:ScoreSetting = manager.getSetting('scoreSetting');
	scoreSettingsUI.createEl('span', {text: i18nHelper.getMessage('124120')})
	const starFullUI = new TextComponent(scoreSettingsUI);
	starFullUI.setPlaceholder(DEFAULT_SETTINGS.scoreSetting.starFull)
		.setValue(scoreSetting.starFull)
		.onChange(async (value) => {
			scoreSetting.starFull = value;
			await manager.plugin.saveSettings();
			showStarExample(scoreShowUI, manager);
		});
	const  starFullEl = starFullUI.inputEl;
	starFullEl.size = DEFAULT_SETTINGS_ARRAY_INPUT_SIZE;
	starFullEl.addClass('obsidian_douban_settings_input')
	scoreSettingsUI.appendChild(starFullEl).appendText("  ");

	scoreSettingsUI.createEl('span', {text: i18nHelper.getMessage('124121')})
	const starEmptyUI = new TextComponent(scoreSettingsUI);
	starEmptyUI.setPlaceholder(DEFAULT_SETTINGS.scoreSetting.starEmpty)
		.setValue(scoreSetting.starEmpty)
		.onChange(async (value) => {
			scoreSetting.starEmpty = value;
			await manager.plugin.saveSettings();
			showStarExample(scoreShowUI, manager);
		});
	const starEmptyEl = starEmptyUI.inputEl;
	starEmptyEl.addClass('obsidian_douban_settings_input')
	starEmptyEl.size = DEFAULT_SETTINGS_ARRAY_INPUT_SIZE;
	scoreSettingsUI.appendChild(starEmptyEl).appendText("  ");

	scoreSettingsUI.createEl('span', {text: i18nHelper.getMessage('124311')})
	const maxStarUI = new TextComponent(scoreSettingsUI);
	maxStarUI.setPlaceholder(i18nHelper.getMessage('124312') + DEFAULT_SETTINGS.scoreSetting.maxStar)
		.setValue(scoreSetting.maxStar + "")
		.onChange(async (value) => {
			if (!NumberUtil.isInt(value) && NumberUtil.value(value) > MAX_STAR_NUMBER && NumberUtil.value(value) < 1) {
				return;
			}
			scoreSetting.maxStar = NumberUtil.value(value);
			await manager.plugin.saveSettings();
			showStarExample(scoreShowUI, manager);
		});
	const maxStarEl = maxStarUI.inputEl;
	maxStarEl.addClass('obsidian_douban_settings_input')
	maxStarEl.size = DEFAULT_SETTINGS_ARRAY_INPUT_SIZE;
	scoreSettingsUI.appendChild(maxStarEl).appendText("  ");

	scoreSettingsUI.createEl('span', {text: i18nHelper.getMessage('124122')})
	const displayEmptyStarUI = new ToggleComponent(scoreSettingsUI);
	displayEmptyStarUI.setValue(scoreSetting.displayStarEmpty)
		.onChange(async (value) => {
			scoreSetting.displayStarEmpty = value;
			await manager.plugin.saveSettings();
			showStarExample(scoreShowUI, manager);
		});
	// displayEmptyStarUI.('obsidian_douban_settings_input')
	const  displayEmptyStarEl = displayEmptyStarUI.toggleEl;
	displayEmptyStarEl.addClass('obsidian_douban_settings_input')
	scoreSettingsUI.appendChild(displayEmptyStarEl).appendText("  ");

	showStarExample(scoreShowUI, manager);
}

export function constructOutUI(containerEl: HTMLElement, manager: SettingsManager) {
	// containerEl.createEl('h3', { text: i18nHelper.getMessage('1220') });

	new Setting(containerEl);
	const attachmentFileSetting = containerEl.createDiv({ cls: 'settings-item-attachment' });
	constructAttachmentFileSettingsUI(attachmentFileSetting, manager);

	const folder = new Setting(containerEl);
	const folderInput = new Setting(containerEl);

	const outFolder = containerEl.createDiv({ cls: 'settings-item' });
	const filePathDisplayExample = containerEl.createDiv('filePath-display-example');

	folder.then(createFolderSelectionSetting({containerEl: containerEl, name: '121501', desc: '121502', placeholder: null, key: null, manager: manager}, filePathDisplayExample));
	folderInput.then(createFolderSelectionSettingInput({containerEl: containerEl, name: null, desc: null, placeholder: '121503', key: 'dataFilePath', manager: manager}, filePathDisplayExample));

	constructOutputFileNameUI(outFolder, filePathDisplayExample, manager);


	new Setting(containerEl).setName(i18nHelper.getMessage('121201')).then((setting) => {
		setting.addDropdown((dropdwon) => {
			setting.descEl.appendChild(
				createFragment((frag) => {
					frag.appendText(i18nHelper.getMessage('121202'));
					frag.createEl('br');
					frag.appendText(i18nHelper.getMessage('121203'));
					frag.createEl('br');
					frag.appendText(i18nHelper.getMessage('121204'));
					frag.createEl('br');
					frag.appendText(i18nHelper.getMessage('121205'));
					frag.createEl('br');
				})
			);
			//   dropdwon.inputEl.addClass("settings_area");
			//   dropdwon.inputEl.setAttr("rows", 10);
			dropdwon.addOption(PersonNameMode.CH_NAME, PersonNameModeRecords.CH)
			dropdwon.addOption(PersonNameMode.EN_NAME, PersonNameModeRecords.EN)
			dropdwon.addOption(PersonNameMode.CH_EN_NAME, PersonNameModeRecords.CH_EN)
			dropdwon.setValue(manager.plugin.settings.personNameMode)
				.onChange(async (value: string) => {
					manager.plugin.settings.personNameMode = value as PersonNameMode;
					await manager.plugin.saveSettings();
				});
		});
	});
	scoreSettingDisplay(containerEl, manager);
}


export function constructOutputFileNameUI(containerEl: HTMLElement, filePathDisplayExample:HTMLDivElement , manager: SettingsManager) {
	containerEl.empty();
	const dataFilePathSetting = new Setting(containerEl);
	dataFilePathSetting.setName(i18nHelper.getMessage('121601'))
		.setDesc(i18nHelper.getMessage('121602'))
		.addText((textField) => {
			textField.setPlaceholder(DEFAULT_SETTINGS.dataFileNamePath)
				.setValue(manager.plugin.settings.dataFileNamePath)
				.onChange(async (value) => {
					manager.plugin.settings.dataFileNamePath = value;
					await manager.plugin.saveSettings();
					showFileExample(filePathDisplayExample, manager);
				});
		});
	dataFilePathSetting.addExtraButton((button) => {
		button
			.setIcon('reset')
			.setTooltip(i18nHelper.getMessage('121902'))
			.onClick(async () => {
				manager.plugin.settings.dataFileNamePath = DEFAULT_SETTINGS.dataFileNamePath;
				await manager.plugin.saveSettings();
				constructOutputFileNameUI(containerEl, filePathDisplayExample, manager)
			});
	})
	showFileExample(filePathDisplayExample, manager);
}


export function constructAttachmentFileSettingsUI(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.empty();
	new Setting(containerEl)
		.setName(i18nHelper.getMessage('121430'))
		.setDesc(i18nHelper.getMessage('121431'))
		.addToggle((toggleComponent) => {
			toggleComponent
				// .setTooltip(i18nHelper.getMessage('121403'))
				.setValue(manager.plugin.settings.cacheImage)
				.onChange(async (value) => {
					manager.plugin.settings.cacheImage = value;
					await manager.plugin.saveSettings();
					constructAttachmentFileSettingsUI(containerEl, manager);
				});
		});

	if(manager.plugin.settings.cacheImage) {
		new Setting(containerEl)
			.setName(i18nHelper.getMessage('121440'))
			.setDesc(i18nHelper.getMessage('121441'))
			.addToggle((toggleComponent) => {
				toggleComponent
					// .setTooltip(i18nHelper.getMessage('121403'))
					.setValue(manager.plugin.settings.pictureBedFlag)
					.onChange(async (value) => {
						manager.plugin.settings.pictureBedFlag = value;
						await manager.plugin.saveSettings();
						constructAttachmentFileSettingsUI(containerEl, manager);
					});
			});
		if (manager.plugin.settings.pictureBedFlag) {
			constructAttachmentFilePictureBedSettingsUI(containerEl, manager);
		}else {
			new Setting(containerEl).then(createFolderSelectionSetting({containerEl: containerEl, name: '121432', desc: '121433', placeholder: null, key: null, manager: manager}));
			new Setting(containerEl).then(createFolderSelectionSettingInput({containerEl: containerEl, name: null, desc: null, placeholder: '121434', key: 'attachmentPath', manager: manager}));

			;
		}

		new Setting(containerEl)
			.setName(i18nHelper.getMessage('121435'))
			.setDesc(i18nHelper.getMessage('121436'))
			.addToggle((toggleComponent) => {
				toggleComponent
					.setTooltip(i18nHelper.getMessage('121437'))
					.setValue(manager.plugin.settings.cacheHighQuantityImage)
					.onChange(async (value) => {
						manager.plugin.settings.cacheHighQuantityImage = value;
						await manager.plugin.saveSettings();
						constructAttachmentFileSettingsUI(containerEl, manager);
					});
			});
	}
}

export function constructAttachmentFilePictureBedSettingsUI(containerEl: HTMLElement, manager: SettingsManager) {

	var pictureBedSetting = manager.plugin.settings.pictureBedSetting
	var pictureBedType = manager.plugin.settings.pictureBedType
	if (manager.plugin.settings.pictureBedFlag && !pictureBedType) {
		pictureBedType = PictureBedType.PicGo
		if (pictureBedSetting == null) {
			pictureBedSetting = PictureBedSetting_PicGo
		}
	}
	var pictureBedTypeSettingsUI = new Setting(containerEl);
	var pictureBedPropertySettingsUI =  new Setting(containerEl).settingEl;
	pictureBedTypeSettingsUI.setName(i18nHelper.getMessage('121451')).then((setting) => {
		setting.addDropdown((dropdwon) => {
			dropdwon.addOptions(PictureBedTypeRecords)
			dropdwon.setValue(manager.plugin.settings.pictureBedType)
				.onChange(async (value: string) => {
					manager.plugin.settings.pictureBedType = value as PictureBedType;
					constructAttachmentFilePictureBedPropertySettingsUI(pictureBedPropertySettingsUI, manager);
					await manager.plugin.saveSettings();
				});
		});
	});
	constructAttachmentFilePictureBedPropertySettingsUI(pictureBedPropertySettingsUI, manager);
}

export function constructAttachmentFilePictureBedPropertySettingsUI(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.empty();
	const pictureBedSetting = manager.plugin.settings.pictureBedSetting
	const pictureBedType = manager.plugin.settings.pictureBedType
	if (pictureBedType == PictureBedType.PicGo) {
		new Setting(containerEl)
			.setName(i18nHelper.getMessage('121461'))
			.addText((textField) => {
				textField.setPlaceholder(PictureBedSetting_PicGo.url)
					.setValue(pictureBedSetting.url)
					.onChange(async (value) => {
						pictureBedSetting.url = value;
						await manager.plugin.saveSettings();
						constructAttachmentFilePictureBedPropertySettingsUI(containerEl, manager);
					});
			});
	}
}
