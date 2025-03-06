import {App, TAbstractFile, TFile, TFolder} from "obsidian";
import {TextInputSuggest} from "./TextInputSuggest";
import SettingsManager from "../SettingsManager";

export class FileTreeSelectSuggest extends TextInputSuggest<TAbstractFile> {
	parentPath: string = "/";
	settingKey: string = "";
	manager: SettingsManager;

	constructor(app: App, inputEl: HTMLInputElement, manager: SettingsManager, settingKey:string) {
		super(app, inputEl);
		this.manager = manager;
		this.settingKey = settingKey;
	}

	getSuggestions(inputStr: string): TAbstractFile[] {
		const files: TAbstractFile[] = [];

		if (inputStr.length == 0 || inputStr.trim().length == 0 || inputStr.trim() == '/') {
			this.searchFiles(this.app.vault.getRoot(), "", files);
			return files;
		}
		let parentSearchPath:string = null;
		let currentName:string = null;

		try {
			const testFile = this.app.vault.getAbstractFileByPath(inputStr.trim())
			if (testFile) {
				if (testFile instanceof TFile && testFile.name.endsWith(".md")) {
					files.push(testFile);
					return files;
				}
				if (testFile instanceof TFolder) {
					parentSearchPath = inputStr.trim();
					currentName = "";
				}
			}
		}catch (e) {

		}
		if (parentSearchPath == null) {
			parentSearchPath = inputStr.lastIndexOf("/") > 0 ? inputStr.substring(0, inputStr.lastIndexOf("/")) : "/";
			currentName = inputStr.lastIndexOf("/") > 0 ? inputStr.substring(inputStr.lastIndexOf("/") + 1) : inputStr;
			currentName = currentName.trim();
		}
		if (currentName == null) {
			currentName = "";
		}
		const root = this.app.vault.getAbstractFileByPath(parentSearchPath) as TFolder;
		if (!root) {
			return [];
		}
		const name = currentName.toLowerCase();
		if (root) {
			this.searchFiles(root, name, files);
		}

		return files;
	}

	searchFiles(folder: TFolder, name: string, files: TAbstractFile[]): void {
		folder.children.forEach((file: TAbstractFile) => {
			if (file.name.toLowerCase().contains(name)) {
				files.push(file);
			}
		});
	}

	renderSuggestion(file: TAbstractFile, el: HTMLElement): void {
		el.setText(file.path);
	}

	selectSuggestion(file: TAbstractFile): void {
		this.inputEl.value = file.path;
		this.parentPath = file.path;
		// this.inputEl.addEventListener("change", () => {
		// 	this.onInputChanged()
		// })
		if (file instanceof TFolder) {
			this.inputEl.value += "/";
			this.inputEl.trigger("input");
		}else {
			//@ts-ignore
			this.manager.updateSetting(this.settingKey, file.path);
			this.close();
		}


	}
}