import DoubanPlugin from "../../../main";
import DoubanSubject, {DoubanParameter} from '../model/DoubanSubject';
import DoubanSubjectLoadHandler from "./DoubanSubjectLoadHandler";
import {moment, request, RequestUrlParam, TFile} from "obsidian";
import {i18nHelper} from 'src/org/wanxp/lang/helper';
import {log} from "src/org/wanxp/utils/Logutil";
import {CheerioAPI, load} from "cheerio";
import YamlUtil from "../../../utils/YamlUtil";
import {
	BasicConst,
	PersonNameMode,
	SearchHandleMode,
	SupportType,
	TemplateKey,
	TemplateTextMode
} from "../../../constant/Constsant";
import HandleContext from "../model/HandleContext";
import HandleResult from "../model/HandleResult";
import {getDefaultTemplateContent} from "../../../constant/DefaultTemplateContent";
import StringUtil from "../../../utils/StringUtil";
import {DEFAULT_SETTINGS} from "../../../constant/DefaultSettings";
import {DoubanUserParameter, UserStateSubject} from "../model/UserStateSubject";
import {DoubanSubjectState, DoubanSubjectStateRecords} from "../../../constant/DoubanUserState";
import DoubanLoginModel from "../../component/DoubanLoginModel";
import DoubanHumanCheckModel from "../../component/DoubanHumanCheckModel";

export default abstract class DoubanAbstractLoadHandler<T extends DoubanSubject> implements DoubanSubjectLoadHandler<T> {


	public doubanPlugin: DoubanPlugin;

	constructor(doubanPlugin: DoubanPlugin) {
		this.doubanPlugin = doubanPlugin;
	}

	async parse(extract: T, context: HandleContext): Promise<HandleResult> {
		let template: string = await this.getTemplate(extract, context);
		await this.saveImage(extract, context);
		let frontMatterStart: number = template.indexOf(BasicConst.YAML_FRONT_MATTER_SYMBOL, 0);
		let frontMatterEnd: number = template.indexOf(BasicConst.YAML_FRONT_MATTER_SYMBOL, frontMatterStart + 1);
		let frontMatter: string = '';
		let frontMatterBefore: string = '';
		let frontMatterAfter: string = '';
		let result: string = '';
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
		let fileName: string = '';
		if (SearchHandleMode.FOR_CREATE == context.mode) {
			fileName = this.parsePartText(this.getFileName(context), extract, context);
		}

		return {content: result, fileName: fileName, subject:extract};
	}

	private getFileName(context: HandleContext): string {
		const {syncConfig} = context;
		if (syncConfig) {
			return syncConfig.dataFileNamePath;
		}
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
			return '';
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

	abstract getSupportType(): SupportType;

	abstract parseText(beforeContent: string, extract: T, context: HandleContext, textMode: TemplateTextMode): string;

	abstract support(extract: DoubanSubject): boolean;

	handle(url: string, context: HandleContext): void {
		let headers = JSON.parse(context.settings.searchHeaders);
		headers.Cookie = context.settings.loginCookiesContent;
		const requestUrlParam: RequestUrlParam = {
			url: url,
			method: "GET",
			headers: headers,
			throw: true
		};
		request(requestUrlParam)
			.then(s => this.humanCheck(s, url))
			.then(load)
			.then(data => this.analysisUserState(data, context))
			.then(({data, userState}) => {
				let sub = this.parseSubjectFromHtml(data);
				sub.userState = userState;
				return sub;
			})
			.then(content => this.toEditor(context, content))
			// .then(content => content ? editor.replaceSelection(content) : content)
			.catch(e =>  {
				log.error(i18nHelper.getMessage('130101',  e.toString()), e);
				if (url) {
					let id = StringUtil.analyzeIdByUrl(url);
					context.syncStatusHolder?context.syncStatusHolder.fail(id, ''):null;
				}else {
					context.syncStatusHolder?context.syncStatusHolder.handled(1):null;

				}
			});
		;

	}


	abstract parseSubjectFromHtml(data: CheerioAPI): T | undefined;

	toEditor(context: HandleContext, extract: T): T {
		this.doubanPlugin.putToObsidian(context, extract);
		return extract;
	}

	getPersonName(name: string, context: HandleContext): string {
		return this.getPersonNameByMode(name, context.settings.personNameMode);
	}

	getPersonNameByMode(name: string, personNameMode: string): string {
		if (!name || !personNameMode) {
			return "";
		}
		let resultName: string;
		let regValue: RegExpExecArray;
		switch (personNameMode) {
			case PersonNameMode.CH_NAME:
				regValue = /[\u4e00-\u9fa50-9\. ·\:\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5\(\)]{2,}/g.exec(name);
				resultName = regValue ? regValue[0] : name;
				break;
			case PersonNameMode.EN_NAME:
				regValue = /[0-9a-zA-Z.\s-:]{2,}/g.exec(name);
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
		let resultContent = this.handleCustomVariable(template, context);
		resultContent = resultContent.replaceAll(DoubanParameter.ID, extract.id)
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
		resultContent = this.parseUserInfo(resultContent, extract, context, textMode);
		return this.parseText(resultContent, extract, context, textMode);
	}

	private parseUserInfo(resultContent: string, extract: T, context: HandleContext, textMode: TemplateTextMode) {
		const userState = extract.userState;
		if ((resultContent.indexOf(DoubanUserParameter.MY_TAGS) >= 0 ||
			resultContent.indexOf(DoubanUserParameter.MY_RATING) >= 0 ||
			resultContent.indexOf(DoubanUserParameter.MY_STATE) >= 0 ||
			resultContent.indexOf(DoubanUserParameter.MY_COMMENT) >= 0 ||
			resultContent.indexOf(DoubanUserParameter.MY_COLLECTION_DATE) >= 0 ) && !this.doubanPlugin.userComponent.isLogin()) {
			log.warn(i18nHelper.getMessage('100113'));
			return resultContent;
		}
		if (!userState || !userState.collectionDate) {
			return resultContent;
		}
		return resultContent.replaceAll(DoubanUserParameter.MY_TAGS, this.handleSpecialContent(userState.tags, textMode, context))
			.replaceAll(DoubanUserParameter.MY_RATING, this.handleSpecialContent(userState.rate, textMode))
			.replaceAll(DoubanUserParameter.MY_STATE, this.getUserStateName(userState.state))
			.replaceAll(DoubanUserParameter.MY_COMMENT, this.handleSpecialContent(userState.comment, textMode))
			.replaceAll(DoubanUserParameter.MY_COLLECTION_DATE, moment(userState.collectionDate).format(context.settings.dateFormat))
	}

	/**
	 * 处理自定义参数
	 * @param template
	 * @param context
	 * @private
	 */
	private handleCustomVariable(template: string, context: HandleContext): string {
		let customProperties = context.settings.customProperties;
		let resultContent = template;
		if (!customProperties) {
			return resultContent;
		}
		customProperties.filter(customProperty => customProperty.name &&
			customProperty.field
			&& (customProperty.field == SupportType.ALL ||
				customProperty.field == this.getSupportType())).forEach(customProperty => {
			resultContent = resultContent.replaceAll(`{{${customProperty.name}}}`, customProperty.value);
		});
		return resultContent;
	}

	private getTemplateKey():TemplateKey {
		let templateKey: TemplateKey;
		switch (this.getSupportType()) {
			case SupportType.MOVIE:
				templateKey = TemplateKey.movieTemplateFile;
				break;
			case SupportType.BOOK:
				templateKey = TemplateKey.bookTemplateFile;
				break;
			case SupportType.MUSIC:
				templateKey = TemplateKey.musicTemplateFile;
				break;
			case SupportType.TELEPLAY:
				templateKey = TemplateKey.teleplayTemplateFile;
				break;
			case SupportType.GAME:
				templateKey = TemplateKey.gameTemplateFile;
				break;
			case SupportType.NOTE:
				templateKey = TemplateKey.noteTemplateFile;
				break;
			default:
				templateKey = null;

		}
		return templateKey;
	}

	private async getTemplate(extract: T, context: HandleContext): Promise<string> {
		const tempKey: TemplateKey = this.getTemplateKey();
		const templatePath: string = context.settings[tempKey];
		let useUserState:boolean = context.userComponent.isLogin() &&
			extract.userState &&
			extract.userState.collectionDate != null  &&
			extract.userState.collectionDate != undefined;

		useUserState = useUserState ? useUserState : false;

		// @ts-ignore
		if (!templatePath || StringUtil.isBlank(templatePath)) {
			return getDefaultTemplateContent(tempKey, useUserState);
		}
		const defaultContent = getDefaultTemplateContent(tempKey, useUserState);
		let firstLinkpathDest: TFile = this.doubanPlugin.app.metadataCache.getFirstLinkpathDest(templatePath, '');
		if (!firstLinkpathDest) {
			return defaultContent;
		} else {
			const val = await this.doubanPlugin.fileHandler.getFileContent(firstLinkpathDest.path);
			return val ? val : defaultContent;
		}
	}

	analysisUserState(html: CheerioAPI, context: HandleContext): {data:CheerioAPI ,  userState: UserStateSubject} {
		if (!context.userComponent.isLogin()) {
			return {data: html, userState: null};
		}
		if(!html('.nav-user-account')) {
			return {data: html, userState: null};
		}
		let rate = html(html('input#n_rating').get(0)).val();
		let tagsStr = html(html('div#interest_sect_level > div.a_stars > span.color_gray').get(0)).text().trim();
		let tags = tagsStr.replace('标签:', '').split(' ');
		let stateWord = html(html('div#interest_sect_level > div.a_stars > span.mr10').get(0)).text().trim();
		let collectionDateStr = html(html('div#interest_sect_level > div.a_stars > span.mr10 > span.collection_date').get(0)).text().trim();
		let userState1 = DoubanAbstractLoadHandler.getUserState(stateWord);
		let component = html(html('div#interest_sect_level > div.a_stars > span.color_gray').get(0)).next().next().text().trim();


		const userState: UserStateSubject = {
			tags: tags,
			rate: rate?Number(rate):null,
			state: userState1,
			collectionDate: collectionDateStr?moment(collectionDateStr, 'YYYY-MM-DD').toDate():null,
			comment: component
		}
		return {data: html, userState: userState};
	}


	public static getUserState(stateWord:string):DoubanSubjectState {
		let state:DoubanSubjectState;
		if(!stateWord) {
			return null;
		}
		if(stateWord.indexOf('想')>=0 ) {
			state = DoubanSubjectState.wish;
		}else if(stateWord.indexOf('在')>=0) {
			state = DoubanSubjectState.do;
		}else if(stateWord.indexOf('过')>=0) {
			state = DoubanSubjectState.collect;
		}else {
			state = DoubanSubjectState.not;
		}
		return state;

	}

	private getUserStateName(state: DoubanSubjectState): string {
		if (!state) {
			return '';
		}
		let v = DoubanSubjectStateRecords[this.getSupportType()];
		switch (state) {
			case DoubanSubjectState.wish:
				return v.wish;
			case DoubanSubjectState.do:
				return v.do;
			case DoubanSubjectState.collect:
				return v.collect;
			case DoubanSubjectState.not:
				return v.not;
			default:
				return '';
		}
	}

	private async saveImage(extract: T, context: HandleContext) {
		const {syncConfig} = context;
		if (!extract.image || (syncConfig && !syncConfig.cacheImage)  || !context.settings.cacheImage) {
			return;
		}
		let image = extract.image;
		const filename = image.split('/').pop();
		let folder = syncConfig? syncConfig.attachmentPath : context.settings.attachmentPath;
		if (!folder) {
			folder = DEFAULT_SETTINGS.attachmentPath;
		}
		const {success, filepath} = await context.netFileHandler.downloadFile(image, folder, filename);
		if (success) {
			extract.image = filepath;
		}
	}

	private async humanCheck(html:any, url:string):Promise<any> {
		if (html && html.indexOf("<title>禁止访问</title>") != -1) {
			const loginModel = new DoubanHumanCheckModel(url);
			await loginModel.load();
			return '';
		}else {
			return html;
		}



	}
}
