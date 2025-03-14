

export const doubanHeaders = {
	"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
	"Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
	"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
};


export const doubanSubjectSyncListUrl = function(subjectType:string, userId:string, doType:string, start:number):string {
	return `https://${subjectType}.douban.com/people/${userId}/${doType}?start=${start}&sort=time&rating=all&filter=all&mode=list`;
}

export const doubanGameSubjectSyncListUrl = function(subjectType:string, userId:string, doType:string, start:number):string {
	return `https://douban.com/people/${userId}/games?start=${start}&sort=time&rating=all&filter=all&mode=list${doType != 'all' ? '&action='+doType : ''}`;
}
