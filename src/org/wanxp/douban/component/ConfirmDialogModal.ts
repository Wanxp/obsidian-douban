import {ButtonComponent, Modal} from "obsidian";
import {i18nHelper} from "../../lang/helper";

export class ConfirmDialogModal extends Modal {
	private promise:Promise<any>;
	private message:string;

	constructor(app: any, message:string, promise: Promise<any>) {
		super(app);
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
				await this.promise;
				this.close();
			}).setClass( "obsidian_douban_search_button");
		new ButtonComponent(controls)
			.setButtonText(i18nHelper.getMessage('110005'))
			.onClick(() => {
				this.close();
			}).setClass( "obsidian_douban_cancel_button");
	}
}
