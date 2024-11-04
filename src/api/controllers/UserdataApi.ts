import { apply, checkToken, showErrorToast } from './auth/decorators';
import { UserdataUpdateUser } from '@/models';
import apiClient from '@/api/';

export class UserdataApi {
	static getUser = apply(
		async (id: number) =>
			await apiClient.GET('/userdata/user/{id}', {
				params: { path: { id } },
			}),
		[checkToken],
		[showErrorToast]
	);

	static getCategories = apply(
		async () => apiClient.GET('/userdata/category'),
		[checkToken],
		[showErrorToast]
	);

	static patchUserById = apply(
		async (id: number, body: UserdataUpdateUser) =>
			await apiClient.POST('/userdata/user/{id}', {
				params: { path: { id } },
				body,
			}),
		[checkToken],
		[showErrorToast]
	);
}
