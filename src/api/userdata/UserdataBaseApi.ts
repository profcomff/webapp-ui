import { BaseApi } from './../BaseApi';
export class UserdataBaseApi extends BaseApi {
	constructor(path: string) {
		super(`/userdata${path}`);
	}
}
