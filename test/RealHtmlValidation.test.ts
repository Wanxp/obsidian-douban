jest.mock("obsidian", () => ({
	getLanguage: () => "zh-CN",
	moment: (value: any) => ({format: () => String(value)}),
	Platform: {isDesktopApp: true},
}), {virtual: true});

import {load} from "cheerio";
import {readFileSync} from "fs";
import {delimiter, join} from "path";
import DoubanPageParser from "../src/org/wanxp/utils/DoubanPageParser";
import DoubanBookLoadHandler from "../src/org/wanxp/douban/data/handler/DoubanBookLoadHandler";
import DoubanMovieLoadHandler from "../src/org/wanxp/douban/data/handler/DoubanMovieLoadHandler";
import {DoubanTeleplayLoadHandler} from "../src/org/wanxp/douban/data/handler/DoubanTeleplayLoadHandler";
import DoubanTheaterLoadHandler from "../src/org/wanxp/douban/data/handler/DoubanTheaterLoadHandler";
import {PersonNameMode, SupportType} from "../src/org/wanxp/constant/Constsant";
import YamlUtil from "../src/org/wanxp/utils/YamlUtil";
import {FileUtil} from "../src/org/wanxp/utils/FileUtil";

const realHtmlDirectory = process.env.DOUBAN_REAL_HTML_DIR;
const realTest = realHtmlDirectory ? it : it.skip;
const issueHtmlDirectory = process.env.DOUBAN_ISSUE_HTML_DIR;
const issueTest = issueHtmlDirectory ? it : it.skip;
const currentChromeHtmlFiles = (process.env.DOUBAN_CURRENT_CHROME_HTML || '').split(delimiter).filter(Boolean);
const currentChromeTest = currentChromeHtmlFiles.length > 0 ? it : it.skip;
const plugin = {} as any;
const context = (title?: string, url?: string) => ({
	settings: {personNameMode: PersonNameMode.CH_EN_NAME},
	listItem: title || url ? {title: title || '', url: url || ''} : undefined,
}) as any;
const read = (name: string) => load(readFileSync(join(realHtmlDirectory, name), 'utf8'));
const readIssue = (name: string) => load(readFileSync(join(issueHtmlDirectory, name), 'utf8'));

describe("downloaded real Douban HTML", () => {
	currentChromeTest.each(currentChromeHtmlFiles)("separates tags and comments from the current logged-in Chrome session: %s", currentChromeHtml => {
		const sourceViewer = load(readFileSync(currentChromeHtml, "utf8"));
		const source = sourceViewer(".line-content")
			.get()
			.map(element => sourceViewer(element).text())
			.join("\n");
		const html = load(source);
		const tags = DoubanPageParser.parseUserTags(html);
		const comment = DoubanPageParser.parseUserComment(html);
		const userStateText = DoubanPageParser.normalizeText(html("#interest_sect_level").text());
		const hasTagLabel = /标签\s*[:：]/.test(userStateText);
		const isMarked = /我(?:看过|想看|在看|读过|想读|在读|听过|想听|在听|玩过|想玩|在玩)/.test(userStateText);
		expect(html(".nav-user-account").length).toBeGreaterThan(0);
		expect(html("#interest_sect_level").length).toBeGreaterThan(0);
		if (hasTagLabel) {
			expect(tags?.length).toBeGreaterThan(0);
		} else {
			expect(tags).toBeNull();
		}
		if (!isMarked) {
			expect(comment).toBeNull();
		}
		if (tags && comment) {
			expect(tags.join(" ")).not.toBe(comment);
		}
	});

	realTest("keeps user tags and comments separate across movie, music, and game DOMs", () => {
		for (const name of [
			"82-365：逆转命运的1年-34902595.html",
			"93-黑镜 第三季-25966044.html",
			"一份有标签、有短评的游戏 HTML.html",
			"一份有标签、有短评的音乐 HTML.html",
		]) {
			const html = read(name);
			const tags = DoubanPageParser.parseUserTags(html);
			const comment = DoubanPageParser.parseUserComment(html);
			expect(tags?.length).toBeGreaterThan(0);
			expect(comment?.length).toBeGreaterThan(0);
			expect(tags.join(' ')).not.toBe(comment);
		}

		const noComment = read("一份有标签但没有短评的游戏或电影 HTML.html");
		expect(DoubanPageParser.parseUserTags(noComment)?.length).toBeGreaterThan(0);
		expect(DoubanPageParser.parseUserComment(noComment)).toBeNull();
	});

	realTest("collects every publisher and producer and limits popular comments", () => {
		const handler = new DoubanBookLoadHandler(plugin);
		const wildGods = handler.parseSubjectFromHtml(read("126-野生神仙-36042223.html"), context());
		expect(wildGods.publisher).toBe("辽宁人民出版社 / 广西师范大学出版社");

		const poe = handler.parseSubjectFromHtml(read("126-爱伦·坡故事集-36512986.html"), context());
		expect(poe.publisher).toBe("江苏凤凰文艺出版社");
		expect(poe.producer).toBe("后浪 / 后浪文学");
		expect(poe.popularComments.length).toBeGreaterThan(0);
		expect(poe.popularComments.length).toBeLessThanOrEqual(5);
	});

	realTest("preserves English title spaces and mixed Chinese-English titles", () => {
		const handler = new DoubanMovieLoadHandler(plugin);
		const underTheSkin = handler.parseSubjectFromHtml(
			read("96-皮囊之下-3749974.html"),
			context("皮囊之下"),
		);
		expect(underTheSkin.title).toBe("皮囊之下");
		expect(underTheSkin.originalTitle).toBe("Under the Skin");

		const hello = handler.parseSubjectFromHtml(
			read("109-Hello！树先生-4135710.html"),
			context("Hello！树先生"),
		);
		expect(hello.title).toBe("Hello！树先生");
		expect(hello.originalTitle).toBe("Hello！树先生");
	});

	realTest("uses the complete normalized TV description", () => {
		const handler = new DoubanTeleplayLoadHandler(plugin);
		const subject = handler.parseSubjectFromHtml(
			read("29-《夜访吸血鬼》电视剧-35700390.html"),
			context("夜访吸血鬼 第一季"),
		);
		expect(subject.desc.length).toBeGreaterThan(400);
		expect(subject.desc).not.toMatch(/\.\.\.$/);
		expect(subject.desc).toBe(subject.desc.trim());
		expect(subject.desc).not.toMatch(/\n[\t ]+/);
	});

	realTest("routes a TVSeries movie URL to the teleplay template type", () => {
		const handler = new DoubanMovieLoadHandler(plugin);
		const subject = handler.parseSubjectFromHtml(
			read("29-《夜访吸血鬼》电视剧-35700390.html"),
			context("夜访吸血鬼 第一季"),
		) as any;
		expect(subject.type).toBe(SupportType.teleplay);
		expect(subject.episode).toBeTruthy();
	});

	realTest("parses the real theater page and tolerates absent optional fields", () => {
		const handler = new DoubanTheaterLoadHandler(plugin);
		const subject = handler.parseSubjectFromHtml(
			read("xx-踏冰逐梦-33575923.html"),
			context("冰上舞剧《踏冰逐梦》", "https://www.douban.com/location/drama/33575923/"),
		);
		expect(subject).toMatchObject({
			id: "33575923",
			title: "冰上舞剧《踏冰逐梦》",
			type: SupportType.theater,
			genre: ["舞剧"],
		});
		expect(subject.director.length).toBeGreaterThan(0);
		expect(subject.author.length).toBeGreaterThan(0);
		expect(subject.actor.length).toBeGreaterThan(0);
		expect(subject.desc.length).toBeGreaterThan(300);
	});

	issueTest("covers open issues with the exact reported Douban subjects", () => {
		const foucault = new DoubanBookLoadHandler(plugin).parseSubjectFromHtml(
			readIssue("foucault.html"),
			context("福柯：关键概念"),
		);
		expect(foucault).toMatchObject({
			id: "34866852",
			title: "福柯：关键概念",
		});
		expect(foucault.originalTitle).toContain("Michel Foucault: Key Concepts");
		expect(YamlUtil.handleText(foucault.originalTitle)).toMatch(/^".*"$/);

		const janeEyre = new DoubanBookLoadHandler(plugin).parseSubjectFromHtml(
			readIssue("jane-eyre.html"),
			context("简·爱"),
		);
		expect(janeEyre.id).toBe("30245411");
		expect(janeEyre.author).toEqual(expect.arrayContaining([expect.stringContaining("夏洛蒂")]));

		const linuxUnix = new DoubanBookLoadHandler(plugin).parseSubjectFromHtml(
			readIssue("linux-unix.html"),
			context("Linux/UNIX系统编程手册"),
		);
		expect(linuxUnix.title).toContain("Linux/UNIX");
		expect(FileUtil.replaceSpecialCharactersForFileName(linuxUnix.title))
			.not.toContain("/");

		const nineteenEightyFourHandler = new DoubanBookLoadHandler(plugin);
		const nineteenEightyFour = nineteenEightyFourHandler.parseSubjectFromHtml(
			readIssue("nineteen-eighty-four.html"),
			context("一九八四"),
		);
		const orwell = nineteenEightyFour.author.find(author => author.includes("奥威尔"));
		expect(orwell).toBeTruthy();
		expect(nineteenEightyFourHandler.handleSpecialAuthorName(orwell))
			.not.toMatch(/[\\/]/);

		const underOnePerson = new DoubanMovieLoadHandler(plugin).parseSubjectFromHtml(
			readIssue("hitori-no-shita.html"),
			context("一人之下 第一季"),
		);
		expect(underOnePerson).toMatchObject({
			id: "26815153",
			type: SupportType.teleplay,
		});
		expect(underOnePerson.actor.length).toBeGreaterThan(0);
		expect(underOnePerson.desc).toBeTruthy();
		expect(YamlUtil.handleText(underOnePerson.desc)).toMatch(/^".*"$/);

		const homeAlone = new DoubanMovieLoadHandler(plugin).parseSubjectFromHtml(
			readIssue("home-alone-guess.html"),
			context("小鬼当家"),
		);
		expect(homeAlone).toMatchObject({
			id: "1293088",
			title: "小鬼当家",
			type: SupportType.movie,
		});
		expect(homeAlone.author).toBeInstanceOf(Array);
	});
});
