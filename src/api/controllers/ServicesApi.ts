import { CategoryInfo, servicesApi } from '../services';
import { useAppsStore } from './../../store/apps';

export class ServicesApi {
	static async getCategories<Info extends CategoryInfo = never>(info?: Info[]) {
		const { data } = await servicesApi.getCategories<Info>(info);
		useAppsStore().categories = data;
	}
}
