import { userdataUserApi } from '../userdata/UserdataUserApi';
import { apply, checkToken, showErrorToast } from './auth/decorators';
import { userdataCategoryApi } from '../userdata/UserdataCategoryApi';

export class UserdataApi {
	static getUser = apply(async (id: number) => await userdataUserApi.getById(id), [checkToken], [showErrorToast]);

	static getCategories = apply(async (info: string) => await userdataCategoryApi.getAll());
}
