import {DoubanPluginSettings} from "src/douban/Douban";

import DoubanPlugin from "main";
import DoubanSubject, {DoubanParameter} from '../model/DoubanSubject';
import DoubanSubjectLoadHandler from "./DoubanSubjectLoadHandler";
import {Editor, moment, request, requestUrl, RequestUrlParam, sanitizeHTMLToDom} from "obsidian";
import { i18nHelper } from 'src/lang/helper';
import { log } from "src/utils/Logutil";
import {CheerioAPI, load} from "cheerio";
import YamlUtil from "../../../utils/YamlUtil";
import {BasicConst, PersonNameMode, TemplateTextMode} from "../../../constant/Constsant";

export default abstract class DoubanAbstractLoadHandler<T extends DoubanSubject> implements DoubanSubjectLoadHandler<T> {
    
    
    public doubanPlugin:DoubanPlugin;

    constructor(doubanPlugin:DoubanPlugin) {
        this.doubanPlugin = doubanPlugin;
    }

	parse(extract: T, settings:DoubanPluginSettings): string {
		let template:string = this.getTemplate(settings);
		let frontMatterStart:number = template.indexOf(BasicConst.YAML_FRONT_MATTER_SYMBOL, 0);
		let frontMatterEnd:number = template.indexOf(BasicConst.YAML_FRONT_MATTER_SYMBOL, frontMatterStart + 1);
		let frontMatter:string = '';
		let frontMatterBefore:string = '';
		let frontMatterAfter:string = '';
		if(frontMatterStart > -1 && frontMatterEnd > -1) {
			frontMatterBefore = template.substring(0, frontMatterStart);
			frontMatter = template.substring(frontMatterStart, frontMatterEnd + 3);
			frontMatterAfter = template.substring(frontMatterEnd + 3);
			if (frontMatterBefore.length > 0) {
				frontMatterBefore = this.parsePartText(frontMatterBefore, extract, settings);
			}
			if (frontMatterAfter.length > 0) {
				frontMatterAfter = this.parsePartText(frontMatterAfter, extract, settings);
			}
			if (frontMatter.length > 0) {
				frontMatter = this.parsePartText(frontMatter, extract, settings, TemplateTextMode.YAML);
			}
			return frontMatterBefore + frontMatter + frontMatterAfter;
		}else {
			return this.parsePartText(template, extract, settings);
		}
	}

	private parsePartText(template: string, extract: T, settings: DoubanPluginSettings, textMode:TemplateTextMode = TemplateTextMode.NORMAL): string {
		let resultContent =  template
			.replaceAll(DoubanParameter.ID, extract.id)
			.replaceAll(DoubanParameter.TITLE, this.handleSpecialContent(extract.title, textMode))
			.replaceAll(DoubanParameter.TYPE, extract.type)
			.replaceAll(DoubanParameter.SCORE, this.handleSpecialContent(extract.score))
			.replaceAll(DoubanParameter.IMAGE, extract.image)
			.replaceAll(DoubanParameter.URL, extract.url)
			.replaceAll(DoubanParameter.DESC, this.handleSpecialContent(extract.desc, textMode))
			.replaceAll(DoubanParameter.PUBLISHER, extract.publisher)
			.replaceAll(DoubanParameter.DATE_PUBLISHED, extract.datePublished ? moment(extract.datePublished).format(settings.dateFormat) : '')
			.replaceAll(DoubanParameter.TIME_PUBLISHED, extract.datePublished ? moment(extract.datePublished).format(settings.timeFormat) : '')
			.replaceAll(DoubanParameter.GENRE, this.handleSpecialContent(extract.genre, textMode, settings))
		;
		return this.parseText(resultContent, extract, settings, textMode);
	}

	/**
	 * 处理特殊字符
	 * @param text
	 * @param textMode
	 */
	handleSpecialText(text: string, textMode: TemplateTextMode):string {
		let result =  text;
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
	handleContentArray(array: any[], settings: DoubanPluginSettings, textMode: TemplateTextMode):string {
		let result = '';
		switch (textMode) {
			case TemplateTextMode.YAML:
				result = array.map(YamlUtil.handleText).join(', ');
				break;
			default:
				result = array.join(settings.arraySpilt);
		}
		return result;
	}

	/**
	 * 处理特殊内容
	 * @param value
	 * @param textMode
	 * @param settings
	 */
	handleSpecialContent(value: any, textMode:TemplateTextMode = TemplateTextMode.NORMAL, settings: DoubanPluginSettings = null): string {
		let result = '';
		if (value instanceof Array) {
			result = this.handleContentArray(value, settings, textMode);
		}else if (value instanceof Number) {
			result = value ? value.toString() : '';
		}else {
			result = this.handleSpecialText(value, textMode);
		}
		return result;
	}

	abstract getTemplate(settings:DoubanPluginSettings):string;

    abstract parseText(beforeContent:string, extract: T, settings:DoubanPluginSettings, textMode:TemplateTextMode): string;

    abstract support(extract: DoubanSubject): boolean;
    
    handle(url:string, editor:Editor):void {
		let requestUrlParam:RequestUrlParam = {
			url: url,
			method: "GET",
			headers:  JSON.parse(this.doubanPlugin.settings.searchHeaders),
			throw: true
		};
		request(requestUrlParam)
            .then(load)
            .then(this.parseSubjectFromHtml)
            .then(content => this.toEditor(editor, content))
            // .then(content => content ? editor.replaceSelection(content) : content)
            .catch(e => log.error(i18nHelper.getMessage('130101')))
        ;

    }

    abstract parseSubjectFromHtml(data:CheerioAPI):T | undefined;
    
    toEditor(editor:Editor, extract: T):T {
        this.doubanPlugin.putToEditor(editor, extract);
        return extract;
    }

    getPersonName(name:string, settings:DoubanPluginSettings):string {
        if(!name || !settings || !settings.personNameMode) {
            return "";
        }
        let resultName:string = "";
		let regValue:RegExpExecArray;
        switch(settings.personNameMode) {
            case PersonNameMode.CH_NAME:
                regValue = /[\u4e00-\u9fa5]{2,20}/g.exec(name);
                resultName = regValue?regValue[0]:name;
                break;
            case PersonNameMode.EN_NAME:
                regValue = /[a-zA-Z.\s\-]{2,50}/g.exec(name);
                resultName = regValue?regValue[0]:name;
                break;
            default:
                resultName = name;
        }
        return resultName;
    }

     html_encode(str:string):string 
    { 
        let s = "";
        if (str.length == 0) return ""; 
        s = str.replace(/&/g, "&amp;"); 
        s = s.replace(/</g, "&lt;"); 
        s = s.replace(/>/g, "&gt;"); 
        s = s.replace(/ /g, "&nbsp;"); 
        s = s.replace(/\'/g, "&#39;"); 
        s = s.replace(/\"/g, "&quot;"); 
            s = s.replace(/\n/g, "<br/>"); 
        return s; 
    } 

     html_decode(str:string):string 
    { 
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

}
