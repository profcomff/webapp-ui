import { userdataUserApi } from '../userdata/UserdataUserApi';
import { apply, checkToken, showErrorToast } from './auth/decorators';
import { userdataCategoryApi } from '../userdata/UserdataCategoryApi';
import { UserdataUpdateUser } from '../models';

export class UserdataApi {
	static getUser = apply(async (id: number) => await userdataUserApi.getById(id), [checkToken], [showErrorToast]);

	static getCategories = apply(
		async () => await userdataCategoryApi.getAllWithParams(),
		[checkToken],
		[showErrorToast],
	);

	static patchUserById = apply(
		async (id: number, body: UserdataUpdateUser) => await userdataUserApi.patchById(id, body),
		[checkToken],
		[showErrorToast],
	);
}
