declare module 'tiny-network' {
    export function get(url:string, headers:any): any;
    export function get(url:string): any;
    export function readStream(param:any): any;
    export function ensureStatusCode(code:number): any;
}