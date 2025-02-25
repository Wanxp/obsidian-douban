import {App, ButtonComponent, Modal} from "obsidian";
import {i18nHelper} from "../../lang/helper";
import {create} from "istanbul-reports";
import DoubanPlugin from "../../main";
import {logger} from "bs-logger";
import {log} from "../../utils/Logutil";

export class ConfirmDialogModal extends Modal {
	private promise:Promise<any>;
	private message:string;
	private doubanPlugin: DoubanPlugin;

	constructor(doubanPlugin: DoubanPlugin, message:string, promise: Promise<any>) {
		super(doubanPlugin.app);
		this.doubanPlugin = doubanPlugin;
		this.message = message;
		this.promise = promise;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.createEl('h3', {text: i18nHelper.getMessage('110152')});
		contentEl.createEl('p', {text: `${this.message}`});
		contentEl.createEl('p', {text: i18nHelper.getMessage('125033')});

		const controls = contentEl.createDiv("controls");
		controls.addClass("obsidian_douban_search_controls")
		new ButtonComponent(controls)
			.setButtonText(i18nHelper.getMessage('110152'))
			.setCta()
			.onClick(async () => {
				//临时特殊处理导入文件
				if (this.message == i18nHelper.getMessage('125046')) {
					createFileSelectModal(this.doubanPlugin);
				}else {
					await this.promise;
				}
				this.close();
			}).setClass( "obsidian_douban_search_button");
		new ButtonComponent(controls)
			.setButtonText(i18nHelper.getMessage('110005'))
			.onClick(() => {
				this.close();
			}).setClass( "obsidian_douban_cancel_button");
	}
}


function createFileSelectModal(doubanPlugin: DoubanPlugin) {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = '.json';
	input.multiple = false;
	input.onchange = async () => {
		const file = input.files[0];
		const reader = new FileReader();
		reader.onload = async () => {
			const settings:object = JSON.parse(reader.result as string);
			try {
				await doubanPlugin.settingsManager.loadAndSaveSettings(settings);
			}catch (e) {
				log.error(i18nHelper.getMessage('125043'), e);
			}
			log.notice(i18nHelper.getMessage('125044'))
		};
		reader.readAsText(file);
	};
	input.click();}