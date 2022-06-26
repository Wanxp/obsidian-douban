import { Notice } from "obsidian";
import SchemaOrg from "./SchemaOrg";
import { i18nHelper } from "lang/helper";

class Logger {

    public error(e:any):any {
        new Notice(i18nHelper.getMessage("Obsidian Douban Plugin Error:") + e);
        return e;
    }

    public warn(e:any):any {
        new Notice(i18nHelper.getMessage("Obsidian Douban Plugin Warn:") + e);
        return e;
    }

    public info(e:any):any {
        // console.log(`Douban Plugin info:` + `${typeof e == 'string' ? e : JSON.stringify(e)}`);
        return e;
    }

    public trace(e:any):any {
        // return e;
        // console.log(`Douban Plugin trace:` + `${typeof e == 'string' ? e : JSON.stringify(e)}`);
        return e;
    }

    public traceN(notion:string, e:any):any {
        // return e;
        // console.log(`${notion} ${typeof e == 'string' ? e : JSON.stringify(e)}`);
        return e;
    }
}

export const log:Logger = new Logger();