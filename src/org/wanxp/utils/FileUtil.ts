import {normalizePath} from "obsidian";

interface ParsedPath {
	/**
	 * The full directory path such as '/home/user/dir' or 'folder/sub'
	 * */
	dir: string;
	/**
	 * The file name without extension
	 * */
	name: string;
	/**
	 * The file extension without the dot.
	 */
	extension:string;
}

export const FileUtil = {
	/**
	 * Parses the file path into a directory and file name.
	 * If the path string does not include a file name, it will default to
	 * 'Untitled'.
	 *
	 * @example
	 * parse('/one/two/file name')
	 * // ==> { dir: '/one/two', name: 'file name' }
	 *
	 * parse('\\one\\two\\file name')
	 * // ==> { dir: '/one/two', name: 'file name' }
	 *
	 * parse('')
	 * // ==> { dir: '', name: 'Untitled' }
	 *
	 * parse('/one/two/')
	 * // ==> { dir: '/one/two/', name: 'Untitled' }
	 */
	parse(pathString: string): ParsedPath {
		const regex = /(?<dir>([^/\\]+[/\\])*)(?<name>[^/\\]*$)/;
		const match = String(pathString).match(regex);
		const { dir, name } = match && match.groups;
		const nameWithoutSpChar = this.replaceSpecialCharactersForFileName(name);
		return { dir, name: nameWithoutSpChar || 'Untitled_' + new Date().getTime(), extension: 'md'};
	},

	/**
	 * Joins multiple strings into a path using Obsidian's preferred format.
	 * The resulting path is normalized with Obsidian's `normalizePath` func.
	 * - Converts path separators to '/' on all platforms
	 * - Removes duplicate separators
	 * - Removes trailing slash
	 */
	join(...strings: string[]): string {
		const parts = strings.map((s) => String(s).trim()).filter((s) => s != null);
		return normalizePath(parts.join('/'));
	},


	/**
	 * replace special characters for filename
	 */
	replaceSpecialCharactersForFileName(fileNameInput: string): string {
		let fileName = fileNameInput.replaceAll(/[\\/:*?"<>|]/g, '_');
		fileName = fileName.replaceAll(/[\n\r\t]/g, '_');
		fileName = fileName.replaceAll(/\s+/g, '_');
		fileName = fileName.replaceAll(/^\.+/g, '_'); // remove leading dots
		fileName = fileName.replaceAll(/\.+$/g, '_'); // remove trailing dots
		fileName = fileName.replaceAll(/_+/g, '_'); // remove duplicate underscores
		return fileName;
	},


};
