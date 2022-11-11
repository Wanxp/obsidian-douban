import { DoubanPluginSetting } from "@App/setting/model/DoubanPluginSetting";
import {App, normalizePath, Platform} from "obsidian";
import { log } from "src/utils/Logutil";
import DoubanPlugin from "../../main";
import {FileUtil} from "../utils/FileUtil";
import {i18nHelper} from "../lang/helper";

/**
 * 文件处理
 * 此段代码逻辑参考了obsidian-advanced-new-file插件
 * @auther: wanxuping
 * @date: 2022/11/01 23:32
 */
export default class FileHandler {

	private _app: App;


	constructor(app:App) {
		this._app = app;
	}

	/**
	 * 创建文件路径如果不存在的话
	 */
	/**
	 * Creates a directory (recursive) if it does not already exist.
	 * This is a helper function that includes a workaround for a bug in the
	 * Obsidian mobile app.
	 */
	private async createDirectory(dir: string): Promise<void> {
		const {vault} = this._app;
		const {adapter} = vault;
		const root = vault.getRoot().path;
		const directoryPath = FileUtil.join(dir);
		const directoryExists = await adapter.exists(directoryPath);
		// ===============================================================
		// -> Desktop App
		// ===============================================================
		if (!Platform.isIosApp) {
			if (!directoryExists) {
				return adapter.mkdir(normalizePath(directoryPath));
			}
		}
		// ===============================================================
		// -> Mobile App (IOS)
		// ===============================================================
		// This is a workaround for a bug in the mobile app:
		// To get the file explorer view to update correctly, we have to create
		// each directory in the path one at time.

		// Split the path into an array of sub paths
		// Note: `normalizePath` converts path separators to '/' on all platforms
		// @example '/one/two/three/' ==> ['one', 'one/two', 'one/two/three']
		// @example 'one\two\three' ==> ['one', 'one/two', 'one/two/three']
		const subPaths: string[] = normalizePath(directoryPath)
			.split('/')
			.filter((part) => part.trim() !== '')
			.map((_, index, arr) => arr.slice(0, index + 1).join('/'));

		// Create each directory if it does not exist
		for (const subPath of subPaths) {
			const directoryExists = await adapter.exists(FileUtil.join(root, subPath));
			if (!directoryExists) {
				await adapter.mkdir(FileUtil.join(root, subPath));
			}
		}

	}

	/**
	 * Handles creating the new note
	 * A new markdown file will be created at the given file path (`input`)
	 * in the specified parent folder (`this.folder`)
	 */
	async creatAttachmentWithData(originalFilePath: string, data:ArrayBuffer): Promise<void> {
		const {vault} = this._app;
		const {adapter} = vault;
		const prependDirInput = FileUtil.join("", originalFilePath);
		const {dir, name} = FileUtil.parse(prependDirInput);
		const filePath = FileUtil.join(dir, `${name}`);

		try {
			const fileExists = await adapter.exists(filePath);
			if (fileExists) {
				// If the file already exists, respond with error
				// throw new Error(i18nHelper.getMessage('110201').replace('{0}', filePath??''));
				return ;
			}
			if (dir !== '') {
				// If `input` includes a directory part, create it
				await this.createDirectory(dir);
			}
			await vault.createBinary(filePath, data);
			// Create the file and open it in the active leaf
		} catch (error) {
			log.error(error.toString(), error);
		}
	}

	/**
	 * Handles creating the new note
	 * A new markdown file will be created at the given file path (`input`)
	 * in the specified parent folder (`this.folder`)
	 */
	async createNewNote(originalFilePath: string): Promise<void> {
		this.createNewNoteWithData(originalFilePath, '');
	}

	/**
	 * Handles creating the new note
	 * A new markdown file will be created at the given file path (`input`)
	 * in the specified parent folder (`this.folder`)
	 */
	async createNewNoteWithData(originalFilePath: string, data:string): Promise<void> {
		const {vault} = this._app;
		const {adapter} = vault;
		const prependDirInput = FileUtil.join("", originalFilePath);
		const {dir, name} = FileUtil.parse(prependDirInput);
		const filePath = FileUtil.join(dir, `${name}.md`);

		try {
			const fileExists = await adapter.exists(filePath);
			if (fileExists) {
				// If the file already exists, respond with error
				throw new Error(i18nHelper.getMessage('110201').replace('{0}', filePath??''));
			}
			if (dir !== '') {
				// If `input` includes a directory part, create it
				await this.createDirectory(dir);
			}
			const File = await vault.create(filePath, data);
			// Create the file and open it in the active leaf
			const leaf = this._app.workspace.splitLeafOrActive();
			await leaf.openFile(File);
		} catch (error) {
			log.error(error.toString(), error);
		}
	}

	async getFileContent(filePath: string | undefined): Promise<string> {
		const { metadataCache, vault } = this._app;
		const normalizedTemplatePath = normalizePath(filePath ?? "");
		if (filePath === "/") {
			return Promise.resolve("");
		}

		try {
			const file = metadataCache.getFirstLinkpathDest(normalizedTemplatePath, "");
			return file ? vault.cachedRead(file) : "";
		} catch (err) {
			console.error(
				`Failed to read the daily note template '${normalizedTemplatePath}'`,
				err
			);
			//TODO i18n
			log.error(i18nHelper.getMessage('110202').replace('{0}', normalizedTemplatePath ?? ''), err);
			return "";
		}
	}



}
