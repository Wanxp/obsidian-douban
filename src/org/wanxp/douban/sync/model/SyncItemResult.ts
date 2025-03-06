import { SyncItemStatus } from "../../../constant/Constsant";

export interface SyncItemResult {
	id: string;
	title: string;
	status: SyncItemStatus;
}
