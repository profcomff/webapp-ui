import { EntityBaseApi } from '../EntityBaseApi';
import { UserdataSource } from '../models';

class UserdataSorceApi extends EntityBaseApi<UserdataSource> {
	constructor() {
		super('/userdata/sorce');
	}
}

export const userdataSourceApi = new UserdataSorceApi();
