import { BaseApi } from '../BaseApi';

export class AuthBaseApi extends BaseApi {
	constructor(path = '') {
		super(`/auth${path}`);
	}
}
