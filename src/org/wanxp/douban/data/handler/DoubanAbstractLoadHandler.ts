import DoubanPlugin from "../../../main";
import DoubanSubject, {DoubanParameterName} from '../model/DoubanSubject';
import DoubanSubjectLoadHandler from "./DoubanSubjectLoadHandler";
import {moment, TFile} from "obsidian";
import {i18nHelper} from 'src/org/wanxp/lang/helper';
import {log} from "src/org/wanxp/utils/Logutil";
import {CheerioAPI, load} from "cheerio";
import YamlUtil from "../../../utils/YamlUtil";
import {
	BasicConst,
	DataValueType,
	PersonNameMode,
	PropertyName,
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
import {DoubanUserParameter, DoubanUserParameterName, UserStateSubject} from "../model/UserStateSubject";
import {
	DoubanSubjectState,
	DoubanSubjectStateRecords,
	DoubanSubjectStateRecords_KEY_WORD_TYPE
} from "../../../constant/DoubanUserState";
import {Person} from "schema-dts";
import HttpUtil from "../../../utils/HttpUtil";
import HtmlUtil from "../../../utils/HtmlUtil";
import {VariableUtil} from "../../../utils/VariableUtil";
import {DataField} from "../../../utils/model/DataField";
import NumberUtil from "../../../utils/NumberUtil";
import {DoubanHttpUtil} from "../../../utils/DoubanHttpUtil";
import {logger} from "bs-logger";

export default abstract class DoubanAbstractLoadHandler<T extends DoubanSubject> implements DoubanSubjectLoadHandler<T> {


	public doubanPlugin: DoubanPlugin;

	constructor(doubanPlugin: DoubanPlugin) {
		this.doubanPlugin = doubanPlugin;
	}

	async parse(extract: T, context: HandleContext): Promise<HandleResult> {
		const template: string = await this.getTemplate(extract, context);
		await this.saveImage(extract, context);
		const frontMatterStart: number = template.indexOf(BasicConst.YAML_FRONT_MATTER_SYMBOL, 0);
		const frontMatterEnd: number = template.indexOf(BasicConst.YAML_FRONT_MATTER_SYMBOL, frontMatterStart + 1);
		let frontMatter = '';
		let frontMatterBefore = '';
		let frontMatterAfter = '';
		let result = '';
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
		let fileName = '';
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





	abstract getSupportType(): SupportType;

	abstract parseVariable(beforeContent: string, variableMap:Map<string, DataField>, extract: T, context: HandleContext, textMode: TemplateTextMode): void;

	abstract support(extract: DoubanSubject): boolean;

	async handle(id: string, context: HandleContext): Promise<T> {
		const url:string = this.getSubjectUrl(id);
		context.plugin.settingsManager.debug(`开始请求地址:${url}`)
		context.plugin.settingsManager.debug(`(注意:请勿向任何人透露你的Cookie,此处若需要截图请**打码**)请求header:${context.settings.loginHeadersContent}`)
		return await DoubanHttpUtil.httpRequestGet(url, context.plugin.settingsManager.getHeaders(), context.plugin.settingsManager)
			.then(load)
			.then(data => this.analysisUserState(data, context))
			.then(({data, userState}) => {
				let guessType = this.getSupportType();
				if (context.syncActive) {
					guessType = this.getGuessType(data);
				}
				const sub = this.parseSubjectFromHtml(data, context);
				sub.userState = userState;
				sub.guessType = guessType;
				return sub;
			})
			.then(content => this.toEditor(context, content))
			// .then(content => content ? editor.replaceSelection(content) : content)
			.catch(e =>  {
				log.error(i18nHelper.getMessage('130101',  e.toString()), e);
				if (url) {
					const id = StringUtil.analyzeIdByUrl(url);
					context.syncStatusHolder?context.syncStatusHolder.syncStatus.fail(id, ''):null;
				}else {
					context.syncStatusHolder?context.syncStatusHolder.syncStatus.handled(1):null;
				}
				return e;
			});


	}

	/**
	 * 通过判断 data中是否包含关键字符串 “我看过的电视剧” 判断是不是 movie
	 * @param data
	 * @private
	 */
	private getGuessType(data: CheerioAPI):SupportType {
		if (data) {
			const text = data.html();
			if (text) {
				for (const [key, value] of DoubanSubjectStateRecords_KEY_WORD_TYPE) {
					if (text.indexOf(key) >= 0) {
						return value;
					}
				}
			}
		}
		return null;
	}


	abstract parseSubjectFromHtml(data: CheerioAPI, context: HandleContext): T | undefined;

	async toEditor(context: HandleContext, extract: T): Promise<T> {
		await this.doubanPlugin.putToObsidian(context, extract);
		return extract;
	}

	getPersonName(name: string, context: HandleContext): string {
		return this.getPersonNameByMode(name, context.settings.personNameMode);
	}

	getPersonName2(originalName: string, chineseName: string, context: HandleContext): string {
		return this.getPersonNameByMode2(originalName, chineseName, context.settings.personNameMode);
	}


	getPersonNameByMode2(originalName: string, chineseName: string, personNameMode: string): string {
		if (!originalName || !personNameMode) {
			return "";
		}
		let resultName: string;
		switch (personNameMode) {
			case PersonNameMode.CH_NAME:
				resultName = chineseName;
				break;
			case PersonNameMode.EN_NAME:
				resultName  = originalName.trim().replace(chineseName, '').trim();
				if (!resultName) {
					resultName = originalName;
				}
				break;
			default:
				resultName = originalName;
		}
		return resultName;
	}


	getPersonNameByMode(name: string, personNameMode: string): string {
		if (!name || !personNameMode) {
			return "";
		}
		let resultName: string;
		let regValue: RegExpExecArray;
		switch (personNameMode) {
			case PersonNameMode.CH_NAME:
				regValue = /[\u4e00-\u9fa50-9. ·:\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5()]{2,}/g.exec(name);
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

	getTitleNameByMode(name: string, personNameMode: string, context: HandleContext): string {
		if (!name || !personNameMode) {
			return "";
		}
		if (context.listItem) {
			const newName = context.listItem.title.trim().replaceAll(' ', '');
			switch (personNameMode) {
				case PersonNameMode.CH_NAME:
					return newName;
					break;
				case PersonNameMode.EN_NAME:
					return name.trim().replaceAll(' ', '').replaceAll(newName, '');
                    break;
			}
		}
		return this.getPersonNameByMode(name, personNameMode);
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
		s = s.replace(/&#39;/g, "'");
		s = s.replace(/&quot;/g, "\"");
		s = s.replace(/<br\/>/g, "\n");
		return s;
	}

	private parsePartText(template: string, extract: T, context: HandleContext, textMode: TemplateTextMode = TemplateTextMode.NORMAL): string {
		const variableMap:Map<string, DataField> = new Map();
		for (const [key, value] of Object.entries(extract)) {
			if (!value) {
				continue;
			}
			const type:DataValueType = VariableUtil.getType(value);
			if (key == 'score') {
				variableMap.set(DoubanParameterName.SCORE_STAR, new DataField(
					DoubanParameterName.SCORE_STAR,
					DataValueType.string,
					value,
					NumberUtil.getRateStar(value, 10, {scoreSetting: context.settings.scoreSetting})
				));
			}
			variableMap.set(key, new DataField(key, type, value, value));
		}
		variableMap.set(DoubanParameterName.IMAGE_URL, new DataField(
			DoubanParameterName.IMAGE_URL,
			DataValueType.url,
			extract.imageUrl,
			extract.imageUrl
		));
		variableMap.set(DoubanParameterName.YEAR_PUBLISHED, new DataField(
			DoubanParameterName.YEAR_PUBLISHED,
			DataValueType.date,
			extract.datePublished,
			extract.datePublished ? moment(extract.datePublished).format('yyyy') : ''
		));
		variableMap.set(DoubanParameterName.DATE_PUBLISHED, new DataField(
			DoubanParameterName.DATE_PUBLISHED,
			DataValueType.date,
			extract.datePublished,
			extract.datePublished ? moment(extract.datePublished).format(context.settings.dateFormat) : ''
		));
		variableMap.set(DoubanParameterName.TIME_PUBLISHED, new DataField(
			DoubanParameterName.TIME_PUBLISHED,
			DataValueType.date,
			extract.datePublished,
			extract.datePublished ? moment(extract.datePublished).format(context.settings.timeFormat) : ''
		));
		const currentDate = new Date();
		variableMap.set(DoubanParameterName.CURRENT_DATE, new DataField(
			DoubanParameterName.CURRENT_DATE,
			DataValueType.date,
			currentDate,
			moment(currentDate).format(context.settings.dateFormat)
		));
		variableMap.set(DoubanParameterName.CURRENT_TIME, new DataField(
			DoubanParameterName.CURRENT_TIME,
			DataValueType.date,
			currentDate,
			moment(currentDate).format(context.settings.timeFormat)
		));

		this.parseUserInfo(template, variableMap, extract, context, textMode);
		this.parseVariable(template, variableMap, extract, context, textMode);
		return VariableUtil.replaceSubject(variableMap, template, this.getSupportType(), this.doubanPlugin.settingsManager);

	}

	private parseUserInfo(resultContent: string, variableMap:Map<string, DataField>, extract: T, context: HandleContext, textMode: TemplateTextMode) {
		const userState = extract.userState;
		if ((resultContent.indexOf(DoubanUserParameter.MY_TAGS) >= 0 ||
			resultContent.indexOf(DoubanUserParameter.MY_RATING) >= 0 ||
			resultContent.indexOf(DoubanUserParameter.MY_STATE) >= 0 ||
			resultContent.indexOf(DoubanUserParameter.MY_COMMENT) >= 0 ||
			resultContent.indexOf(DoubanUserParameter.MY_COLLECTION_DATE) >= 0 ) && !this.doubanPlugin.userComponent.isLogin()) {
			log.warn(i18nHelper.getMessage('100113'));
			return resultContent;
		}
		if (!userState) {
			return resultContent;
		}
		let tags: string[] = [];
		if (userState.tags && userState.tags.length > 0 ) {
			tags = [extract.type, ...userState.tags.map(tag => tag.trim())];
		}else {
			tags = [extract.type];
		}
		Object.entries(userState).forEach(([key, value]) => {
			if (!value) {
				return;
			}
			variableMap.set(key, new DataField(key, VariableUtil.getType(value), value, value));
		});
		if (userState.tags && userState.tags.length > 0 ) {
			variableMap.set(DoubanUserParameterName.MY_TAGS, new DataField(DoubanUserParameterName.MY_TAGS, DataValueType.array, tags, tags));
		}
		if (userState.comment) {
			variableMap.set(DoubanUserParameterName.MY_COMMENT, new DataField(
				DoubanUserParameterName.MY_COMMENT,
				DataValueType.string,
				userState.comment,
				userState.comment
			));
		}
		if (userState.state) {
			variableMap.set(DoubanUserParameterName.MY_STATE, new DataField(
				DoubanUserParameterName.MY_STATE,
				DataValueType.string,
				userState.state,
				this.getUserStateName(userState.state)
			));
		}
		if (userState.rate) {
			variableMap.set(DoubanUserParameterName.MY_RATING, new DataField(
				DoubanUserParameterName.MY_RATING,
				DataValueType.number,
				userState.rate,
				userState.rate)
			);
			variableMap.set(DoubanUserParameterName.MY_RATING_STAR, new DataField(
				DoubanUserParameterName.MY_RATING_STAR,
				DataValueType.string,
				userState.rate,
				NumberUtil.getRateStar(userState.rate, 5, {scoreSetting: context.settings.scoreSetting})
			));
		}
		if (userState.collectionDate) {
			variableMap.set(DoubanUserParameterName.MY_COLLECTION_DATE, new DataField(
				DoubanUserParameterName.MY_COLLECTION_DATE,
				DataValueType.date,
				userState.collectionDate,
				userState.collectionDate ? moment(userState.collectionDate).format(context.settings.dateFormat) : ''
			));
		}

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
		const {syncConfig} = context;
		if (syncConfig) {
			if(syncConfig.templateFile) {
				const val = await this.doubanPlugin.fileHandler.getFileContent(syncConfig.templateFile);
				if (val) {
					return val;
				}
			}
		}
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
		const firstLinkpathDest: TFile = this.doubanPlugin.app.metadataCache.getFirstLinkpathDest(templatePath, '');
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
		return this. analysisUser(html, context);
	}

	abstract analysisUser(html: CheerioAPI, context: HandleContext): {data:CheerioAPI ,  userState: UserStateSubject};


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
		const v = DoubanSubjectStateRecords[this.getSupportType()];
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
		const image = extract.image;
		const filename = image.split('/').pop();
		let folder = syncConfig? syncConfig.attachmentPath : context.settings.attachmentPath;
		if (!folder) {
			folder = DEFAULT_SETTINGS.attachmentPath;
		}
		const referHeaders = {'referer': image};
		if ((syncConfig ? syncConfig.cacheHighQuantityImage : context.settings.cacheHighQuantityImage) && context.userComponent.isLogin()) {
			try {
				const fileNameSpilt = filename.split('.');
				const highFilename = fileNameSpilt.first() + '.jpg';

				const highImage = this.getHighQuantityImageUrl(highFilename);
				const resultValue = await this.handleImage(highImage, folder, highFilename, context, false, referHeaders);
				if (resultValue && resultValue.success) {
					extract.image = resultValue.filepath;
					return;
				}

			}catch (e) {
				console.error(e);
				console.error('下载高清封面失败，将会使用普通封面')
			}
		}
		const resultValue = await this.handleImage(image, folder, filename, context, true, referHeaders);
		if (resultValue && resultValue.success) {
			extract.image = resultValue.filepath;
		}
	}

	private async handleImage(image: string, folder: string, filename: string, context: HandleContext, showError: boolean, headers?: any) {
		if (context.settings.pictureBedFlag) {
			//临时限定只支持PicGo
			const checked = await context.netFileHandler.downloadDBUploadPicGoByClipboardBefore(context);
			if (!checked) {
				//TODO 国际化
				log.notice('未检测到PicGo软件, 请检查是否已开启PicGo的Server服务或者检查插件中配置地址是否正确，现使用默认的下载到本地的方式');
				return  await context.netFileHandler.downloadDBFile(image, folder, filename, context, false, headers);
			}
			return await context.netFileHandler.downloadDBUploadPicGoByClipboard(image, filename, context, showError, headers);
		}else {
			return  await context.netFileHandler.downloadDBFile(image, folder, filename, context, false, headers);
		}

	}

	abstract getHighQuantityImageUrl(fileName:string):string;

	abstract getSubjectUrl(id:string):string;

	handlePersonNameByMeta(html: CheerioAPI, movie: DoubanSubject, context: HandleContext,
								   metaProperty:string, objectProperty:string) {
		const metaProperties: string[] = html(`head > meta[property='${metaProperty}']`).get()
			.map((e) => {
				return html(e).attr('content');
			});
		// @ts-ignore
		movie[objectProperty]
			// @ts-ignore
			.filter((p:Person) => p.name)
			// @ts-ignore
			.map((p:Person) => {
				// @ts-ignore
				const persons = metaProperties.filter((a) => p.name.indexOf(a) >= 0);
				if (persons) {
					// @ts-ignore
					p.name = this.getPersonName2(p.name, persons[0], context);
				}
			})
	}


	protected getPropertyValue(html: CheerioAPI, name: PropertyName): string {
		return HtmlUtil.getHtmlText(html, this.doubanPlugin.settingsManager.getSelector(this.getSupportType(), name));
	}




}
