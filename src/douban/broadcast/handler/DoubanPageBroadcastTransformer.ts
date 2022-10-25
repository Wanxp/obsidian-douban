import { CheerioAPI } from "cheerio";
import { DoubanBroadcastAbstractHandler } from "./DoubanBroadcastAbstractHandler";
import { DoubanBroadcastMovieHandler } from "./DoubanBroadcastMovieHandler";
import DoubanBroadcastSubject from "../model/DoubanBroadcastSubject";
import DoubanPageBroadcastSubject from "../model/DoubanPageBroadcastSubject";

//TODO will support in future version
export class DoubanPageBroadcastTransformer {
  
  private handlers:DoubanBroadcastAbstractHandler<DoubanBroadcastSubject>[];
  
  
  constructor() {
    this.handlers = [
      new DoubanBroadcastMovieHandler(),
    ]

  }

  public transform(data: CheerioAPI):DoubanPageBroadcastSubject {
    let doubanBroadcastSubjects:DoubanBroadcastSubject[] = data('.new-status .status-wrapper')
    .get()
    .map(i => this.transformElement(i, data));
    return new DoubanPageBroadcastSubject ();
  }

  public transformElement(element:any, source:CheerioAPI):DoubanBroadcastSubject {
    let  targetType:string = element.innerHTML;
    return this.handlers.filter(h => h.support(targetType))[0].transform(element, source);
  }

}
