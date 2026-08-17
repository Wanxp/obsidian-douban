jest.mock("obsidian", () => ({
	moment: jest.fn(),
}), {virtual: true});

import {load} from "cheerio";
import {DEFAULT_TEMPLATE_CONTENT} from "../src/org/wanxp/constant/DefaultTemplateContent";
import DoubanMusicLoadHandler from "../src/org/wanxp/douban/data/handler/DoubanMusicLoadHandler";

describe("DoubanMusicLoadHandler", () => {
	it("extracts track-list items in order for the menu template variable", () => {
		const html = load(`
			<html>
				<head>
					<meta property="og:title" content="测试专辑">
					<meta property="og:url" content="https://music.douban.com/subject/12345678/">
					<meta property="og:image" content="https://img1.doubanio.com/cover.jpg">
				</head>
				<body>
					<div class="track-list">
						<ul class="track-items">
							<li>  01. 第一首  </li>
							<li>02. 第二首</li>
							<li>
								03. 第三首
							</li>
						</ul>
					</div>
				</body>
			</html>
		`);

		const subject = new DoubanMusicLoadHandler({} as any).parseSubjectFromHtml(html, {} as any);

		expect(subject.menu).toEqual([
			"01. 第一首",
			"02. 第二首",
			"03. 第三首",
		]);
		expect(DEFAULT_TEMPLATE_CONTENT.musicTemplateFileContent).toContain("{{menu}}");
	});
});
