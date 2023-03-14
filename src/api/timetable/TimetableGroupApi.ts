import { ArrayResponse, StudyGroup } from './../models';
import { TimetableBaseApi } from './TimetaleBaseApi';

type StudyGroupNoId = Omit<StudyGroup, 'id'>;

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
		return this.get<StudyGroup>(`/${id}`);
	}

	public async deleteGroup(id: number) {
		return this.delete<string>(`/${id}`);
	}

	public async patchGroup(id: number, body: StudyGroupNoId) {
		return this.patch<StudyGroup, StudyGroupNoId>(`/${id}`, body);
	}

	public async getGroups(params?: GetGroupsParams) {
		return this.get<ArrayResponse<StudyGroup>, GetGroupsParams>('/', params);
	}

	public async createGroup(group: StudyGroupNoId) {
		return this.post<StudyGroup, StudyGroupNoId>('', group);
	}
}

export const timetableGroupApi = new TimetableGroupApi();
