import { userdataUserApi } from '../userdata/UserdataUserApi';
import { apply, showErrorToast } from './auth/decorators';

export class UserdataApi {
	static getUser = apply(async (id: number) => await userdataUserApi.getById(id), [showErrorToast]);
}
