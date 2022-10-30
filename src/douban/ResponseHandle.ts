import {Notice} from "obsidian";

export const ensureStatusCode = (expected: any) => {
	if (!Array.isArray(expected))
		expected = [expected];
	return (res: any) => {
		const {statusCode} = res;
		if (!expected.includes(statusCode)) {
			new Notice(`Request Douban failed, Status code must be "${expected}" but actually "${statusCode}"`)
		}
		return res;
	};
};
