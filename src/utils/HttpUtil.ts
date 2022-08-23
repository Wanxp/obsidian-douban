import * as https from 'https';

import { get } from 'tiny-network';
import { log } from './Logutil';

export default class HttpUtil {

    static getHttps(url:string, options:any):Promise<any> {
        return new Promise<any>(
            function (resolve, reject) {
               https.get(url + '/', options, (response) => {
                console.log('url:', url + '/');
                 console.log('statusCode:', response.statusCode);
                 console.log('headers:', response.headers);
                if (response.statusCode === 200) {
                  response.on('data', (d) => {
                    resolve(d);
                  });
                } if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode == 303) {
                  resolve(response.headers.location);
                } else {
                  reject(new Error(response.statusMessage));
                }
                response.on('data', (d) => {
                   process.stdout.write(d);
                 });
              
               }).on('error', (e) => {
                  reject(new Error('XMLHttpRequest Error: ' + e.message));
               });

            });
    }
}