import { EntityBaseApi } from '../EntityBaseApi';
import { UserdataCategory } from '../models';

class UserdataCategoryApi extends EntityBaseApi<UserdataCategory> {
	constructor() {
		super('/userdata/category');
	}

	public async getAllWithParams() {
		return this.get<UserdataCategory[]>('?query=param');
	}
}

export const userdataCategoryApi = new UserdataCategoryApi();
