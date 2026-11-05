import SyncStatusHolder from '../src/org/wanxp/douban/sync/model/SyncStatusHolder';
import {SyncConfig} from '../src/org/wanxp/douban/sync/model/SyncConfig';

jest.mock('obsidian', () => ({getLanguage: () => 'en', Notice: jest.fn()}), {virtual: true});

it('keeps the incremental history of a different media type in the same folder', () => {
	const folder = 'Media+Notes';
	const status = new SyncStatusHolder({
		dataFilePath: folder, syncType: 'book', scope: 'wish', incrementalUpdate: true,
	} as SyncConfig);
	status.initSyncHandledData([
		{key: `${folder}+book+wish`, value: ['1001']},
		{key: `${folder}+book+collect`, value: ['1002']},
		{key: `${folder}+movie+collect`, value: ['1003']},
	]);

	expect(status.shouldSync('1001')).toBe(false);
	expect([...status.handledData.get(`${folder}+movie+collect`)]).toEqual(['1003']);
	expect(status.handledData.get(`${folder}+book+collect`).size).toBe(0);
});
