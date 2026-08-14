jest.mock("obsidian", () => ({
	getLanguage: () => "zh-CN",
	moment: (value: any) => ({format: () => String(value)}),
	Platform: {isDesktopApp: true},
}), {virtual: true});

import DoubanBookLoadHandler from "../src/org/wanxp/douban/data/handler/DoubanBookLoadHandler";

describe("DoubanBookLoadHandler", () => {
	const handler = new DoubanBookLoadHandler({} as any);

	it("removes nationality brackets without turning them into path separators", () => {
		expect(handler.handleSpecialAuthorName("[英] 乔治·奥威尔"))
			.toBe("英 乔治·奥威尔");
	});

	it("does not alter author names that have no nationality brackets", () => {
		expect(handler.handleSpecialAuthorName("George Orwell"))
			.toBe("George Orwell");
	});
});
