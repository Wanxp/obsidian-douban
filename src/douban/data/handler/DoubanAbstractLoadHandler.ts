
import DoubanPlugin from "main";
import DoubanSubject, {DoubanParameter} from '../model/DoubanSubject';
import DoubanSubjectLoadHandler from "./DoubanSubjectLoadHandler";
import {moment, request, RequestUrlParam, TFile} from "obsidian";
import {i18nHelper} from 'src/lang/helper';
import {log} from "src/utils/Logutil";
import {CheerioAPI, load} from "cheerio";
import YamlUtil from "../../../utils/YamlUtil";
import {BasicConst, PersonNameMode, SearchHandleMode, TemplateKey, TemplateTextMode} from "../../../constant/Constsant";
import HandleContext from "@App/data/model/HandleContext";
import HandleResult from "@App/data/model/HandleResult";
import {DEFAULT_TEMPLATE_CONTENT, getDefaultTemplateContent} from "../../../constant/DefaultTemplateContent";
import FileHandler from "../../../file/FileHandler";
import StringUtil from "../../../utils/StringUtil";
import {DEFAULT_SETTINGS} from "../../../constant/DefaultSettings";

export default abstract class DoubanAbstractLoadHandler<T extends DoubanSubject> implements DoubanSubjectLoadHandler<T> {


	public doubanPlugin: DoubanPlugin;

	constructor(doubanPlugin: DoubanPlugin) {
		this.doubanPlugin = doubanPlugin;
	}

	async parse(extract: T, context: HandleContext): Promise<HandleResult> {
		let template: string =  await this.getTemplate(context);
		let frontMatterStart: number = template.indexOf(BasicConst.YAML_FRONT_MATTER_SYMBOL, 0);
		let frontMatterEnd: number = template.indexOf(BasicConst.YAML_FRONT_MATTER_SYMBOL, frontMatterStart + 1);
		let frontMatter: string = '';
		let frontMatterBefore: string = '';
		let frontMatterAfter: string = '';
		let result:string = '';
		if (frontMatterStart > -1 && frontMatterEnd > -1) {
			frontMatterBefore = template.substring(0, frontMatterStart);
			frontMatter = template.substring(frontMatterStart, frontMatterEnd + 3);
			frontMatterAfter = template.substring(frontMatterEnd + 3);
			if (frontMatterBefore.length > 0) {
				frontMatterBefore = this.parsePartText(frontMatterBefore, extract, context);
			}
			if (frontMatterAfter.length > 0) {
				frontMatterAfter = this.parsePartText(frontMatterAfter, extract, context);
			}
			if (frontMatter.length > 0) {
				frontMatter = this.parsePartText(frontMatter, extract, context, TemplateTextMode.YAML);
			}
			result = frontMatterBefore + frontMatter + frontMatterAfter;
		} else {
			result = this.parsePartText(template, extract, context);
		}
		let fileName:string = '';
		if (SearchHandleMode.FOR_CREATE == context.mode) {
			fileName = this.parsePartText(this.getFileName(context), extract, context);
		}

		return {content: result, fileName: fileName};
	}

	private getFileName(context:HandleContext): string {
		const {dataFileNamePath} = context.settings;
		return dataFileNamePath ? dataFileNamePath : DEFAULT_SETTINGS.dataFileNamePath;
	}

	/**
	 * 处理特殊字符
	 * @param text
	 * @param textMode
	 */
	handleSpecialText(text: string, textMode: TemplateTextMode): string {
		let result = text;
		switch (textMode) {
			case TemplateTextMode.YAML:
				result = YamlUtil.handleText(text);
				break;
		}
		return result;
	}

	/**
	 * 处理内容数组
	 * @param array
	 * @param settings
	 * @param textMode
	 */
	handleContentArray(array: any[], context: HandleContext, textMode: TemplateTextMode): string {
		let result;
		switch (textMode) {
			case TemplateTextMode.YAML:
				result = array.map(YamlUtil.handleText).join(', ');
				break;
			default:
				result = array.join(context.settings.arraySpilt);
		}
		return result;
	}

	/**
	 * 处理特殊内容
	 * @param value
	 * @param textMode
	 * @param settings
	 */
	handleSpecialContent(value: any, textMode: TemplateTextMode = TemplateTextMode.NORMAL, context: HandleContext = null): string {
		let result;
		if (!value) {
			return i18nHelper.getMessage('410101');
		}
		if (value instanceof Array) {
			result = this.handleContentArray(value, context, textMode);
		} else if (value instanceof Number) {
			result = value.toString();
		} else {
			result = this.handleSpecialText(value, textMode);
		}
		return result;
	}

	abstract getTemplateKey(context: HandleContext): TemplateKey;

	abstract parseText(beforeContent: string, extract: T, context: HandleContext, textMode: TemplateTextMode): string;

	abstract support(extract: DoubanSubject): boolean;

	handle(url: string, context: HandleContext): void {
		const requestUrlParam: RequestUrlParam = {
			url: url,
			method: "GET",
			headers: JSON.parse(this.doubanPlugin.settings.searchHeaders),
			throw: true
		};
		request(requestUrlParam)
			.then(load)
			.then(this.parseSubjectFromHtml)
			.then(content => this.toEditor(context, content))
			// .then(content => content ? editor.replaceSelection(content) : content)
			.catch(e => log.error(i18nHelper.getMessage('130101')))
		;

	}

	abstract parseSubjectFromHtml(data: CheerioAPI): T | undefined;

	toEditor(context: HandleContext, extract: T): T {
		this.doubanPlugin.putToObsidian(context, extract);
		return extract;
	}

	getPersonName(name: string, context: HandleContext): string {
		const {settings} = context;
		if (!name || !settings || !settings.personNameMode) {
			return "";
		}
		let resultName: string;
		let regValue: RegExpExecArray;
		switch (settings.personNameMode) {
			case PersonNameMode.CH_NAME:
				regValue = /[\u4e00-\u9fa50-9.]{2,20}/g.exec(name);
				resultName = regValue ? regValue[0] : name;
				break;
			case PersonNameMode.EN_NAME:
				regValue = /[0-9a-zA-Z.\s-]{2,50}/g.exec(name);
				resultName = regValue ? regValue[0] : name;
				break;
			default:
				resultName = name;
		}
		return resultName;
	}

	// html_encode(str: string): string {
	// 	let s = "";
	// 	if (str.length == 0) return "";
	// 	s = str.replace(/&/g, "&amp;");
	// 	s = s.replace(/</g, "&lt;");
	// 	s = s.replace(/>/g, "&gt;");
	// 	s = s.replace(/ /g, "&nbsp;");
	// 	s = s.replace(/\'/g, "&#39;");
	// 	s = s.replace(/\"/g, "&quot;");
	// 	s = s.replace(/\n/g, "<br/>");
	// 	return s;
	// }

	html_decode(str: string): string {
		let s = "";
		if (str.length == 0) return "";
		s = str.replace(/&amp;/g, "&");
		s = s.replace(/&lt;/g, "<");
		s = s.replace(/&gt;/g, ">");
		s = s.replace(/&nbsp;/g, " ");
		s = s.replace(/&#39;/g, "\'");
		s = s.replace(/&quot;/g, "\"");
		s = s.replace(/<br\/>/g, "\n");
		return s;
	}

	private parsePartText(template: string, extract: T, context: HandleContext, textMode: TemplateTextMode = TemplateTextMode.NORMAL): string {
		const resultContent = template
			.replaceAll(DoubanParameter.ID, extract.id)
			.replaceAll(DoubanParameter.TITLE, this.handleSpecialContent(this.getPersonName(extract.title, context), textMode))
			.replaceAll(DoubanParameter.TYPE, extract.type)
			.replaceAll(DoubanParameter.SCORE, this.handleSpecialContent(extract.score))
			.replaceAll(DoubanParameter.IMAGE, extract.image)
			.replaceAll(DoubanParameter.URL, extract.url)
			.replaceAll(DoubanParameter.DESC, this.handleSpecialContent(extract.desc, textMode))
			.replaceAll(DoubanParameter.PUBLISHER, extract.publisher)
			.replaceAll(DoubanParameter.DATE_PUBLISHED, extract.datePublished ? moment(extract.datePublished).format(context.settings.dateFormat) : '')
			.replaceAll(DoubanParameter.TIME_PUBLISHED, extract.datePublished ? moment(extract.datePublished).format(context.settings.timeFormat) : '')
			.replaceAll(DoubanParameter.CURRENT_DATE, moment(new Date()).format(context.settings.dateFormat))
			.replaceAll(DoubanParameter.CURRENT_TIME, moment(new Date()).format(context.settings.timeFormat))
			.replaceAll(DoubanParameter.GENRE, this.handleSpecialContent(extract.genre, textMode, context))
		;
		return this.parseText(resultContent, extract, context, textMode);
	}

	private async getTemplate(context: HandleContext):Promise<string> {
		const tempKey:TemplateKey =  this.getTemplateKey(context);
		const templatePath:string = context.settings[tempKey];

		// @ts-ignore
		if (!templatePath || StringUtil.isBlank(templatePath)) {
			return getDefaultTemplateContent(tempKey);
		}
		const defaultContent =  getDefaultTemplateContent(tempKey);
		let firstLinkpathDest:TFile = this.doubanPlugin.app.metadataCache.getFirstLinkpathDest(templatePath, '');
		if (!firstLinkpathDest) {
			return defaultContent;
		}else {
			 const val = await this.doubanPlugin.fileHandler.getFileContent(firstLinkpathDest.path);
			 return val?val:defaultContent;
		}
	}
}
