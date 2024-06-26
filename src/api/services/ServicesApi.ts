import { BaseApi } from '../BaseApi';
import { AppButton, AppButtonCategory, ServiceData } from '../models';

type GetButtonsResponse = AppButtonCategory & {
	buttons: AppButton[];
};

export enum CategoryInfo {
	Buttons = 'buttons',
}

class ServicesApi extends BaseApi {
	constructor() {
		super('/services');
	}

	public async getCategories<Info extends CategoryInfo = never>(info?: Info[]) {
		return this.get<
			Array<
				AppButtonCategory & {
					buttons: CategoryInfo.Buttons extends Info ? AppButton[] : never;
				}
			>,
			{ info?: Info[] }
		>('/category', { info });
	}

	public getButtons(categoryId: number) {
		return this.get<GetButtonsResponse>(`/category/${categoryId}/button/`);
	}

	public getService(serviceId: number) {
		return this.get<ServiceData>(`/service/${serviceId}`);
	}
}

export const servicesApi = new ServicesApi();
