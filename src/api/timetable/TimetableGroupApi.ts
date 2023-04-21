import { GetAllParams } from './../EntityBaseApi';
import { StudyGroup } from './../models';
import { TimetableEntityBaseApi } from './TimetaableEntityBaseApi';

export interface GetGroupsParams extends GetAllParams {
	query?: string;
}

class TimetableGroupApi extends TimetableEntityBaseApi<StudyGroup, GetGroupsParams> {
	constructor() {
		super('/group');
	}
}

export const timetableGroupApi = new TimetableGroupApi();
