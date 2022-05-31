import { Notice } from "obsidian";

class Logger {

    public error(e:any):any {
        new Notice("Douban Plugin Error: " + e);
        return e;
    }

    public warn(e:any):any {
        new Notice("Douban Plugin Warn: " + e);
        return e;
    }

    public info(e:any):any {
        console.log("Douban Plugin Warn: " + e);
        return e;
    }
}

export const log:Logger = new Logger();