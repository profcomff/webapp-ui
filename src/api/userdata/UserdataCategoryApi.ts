import { EntityBaseApi } from '../EntityBaseApi';
import { UserdataCategory } from '../models';

class UserdataCategoryApi extends EntityBaseApi<UserdataCategory> {
	constructor() {
		super('/userdata/category');
	}
}

export const userdataCategoryApi = new UserdataCategoryApi();
