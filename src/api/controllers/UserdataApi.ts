import { userdataUserApi } from '../userdata/UserdataUserApi';
import { apply, checkToken, showErrorToast } from './auth/decorators';

export class UserdataApi {
	static getUser = apply(
		async (id: number) => {
			const promise = await userdataUserApi.getById(id);
			return promise;
		},
		[checkToken],
		[showErrorToast],
	);
}
