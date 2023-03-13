import { ArrayResponse, Group } from './../models';
import { TimetableBaseApi } from './TimetaleBaseApi';

type GroupWithoutId = Omit<Group, 'id'>;

export interface GetGroupsParams {
	query?: string;
	limit?: number;
	offset?: number;
}

class TimetableGroupApi extends TimetableBaseApi {
	constructor() {
		super('/group');
	}

	public async getGroup(id: number) {
		return this.get<Group>(`/${id}`);
	}

	public async deleteGroup(id: number) {
		return this.delete<string>(`/${id}`);
	}

	public async patchGroup(id: number, body: GroupWithoutId) {
		return this.patch<Group, GroupWithoutId>(`/${id}`, body);
	}

	public async getGroups(params?: GetGroupsParams) {
		return this.get<ArrayResponse<Group>, GetGroupsParams>('/', params);
	}

	public async createGroup(group: GroupWithoutId) {
		return this.post<Group, GroupWithoutId>('', group);
	}
}

export const timetableGroupApi = new TimetableGroupApi();
