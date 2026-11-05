import {App, TFile, TFolder} from 'obsidian';
import FileHandler from '../src/org/wanxp/file/FileHandler';

jest.mock('obsidian', () => ({
	TFile: class {},
	TFolder: class {},
	getLanguage: () => 'en',
	normalizePath: (path: string) => path.replace(/\/+/g, '/').replace(/^\/|\/$/g, ''),
	Notice: jest.fn(),
	Platform: {},
}), {virtual: true});

const subject = {id: '12345', type: 'book'};

function setup(path: string, doubanId: number) {
	const note = Object.assign(Object.create(TFile.prototype), {path, extension: 'md'});
	const folder = Object.assign(Object.create(TFolder.prototype), {children: [note]});
	const create = jest.fn(async () => undefined);
	const app = {
		metadataCache: {getFileCache: () => ({frontmatter: {doubanId, type: 'book'}})},
		vault: {
			getAbstractFileByPath: (path: string) => path === 'Books' ? folder : null,
			getRoot: () => ({path: '/'}),
			adapter: {exists: async (target: string) => target === 'Books' || target === path},
			create,
		},
	};
	return {handler: new FileHandler(app as unknown as App), create};
}

it('reuses a renamed note and reports its actual path', async () => {
	const {handler, create} = setup('Books/My renamed note.md', 12345);
	await expect(handler.createSyncNote('Books/Current title', 'text', false, subject))
		.resolves.toEqual({created: false, path: 'Books/My renamed note.md'});
	expect(create).not.toHaveBeenCalled();
});

it('keeps two editions with the same title in separate files', async () => {
	const {handler, create} = setup('Books/Current title.md', 67890);
	await expect(handler.createSyncNote('Books/Current title', 'text', false, subject))
		.resolves.toEqual({created: true, path: 'Books/Current title--12345.md'});
	expect(create).toHaveBeenCalledWith('Books/Current title--12345.md', 'text');
});
