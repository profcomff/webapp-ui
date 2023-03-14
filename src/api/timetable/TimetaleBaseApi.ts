import { BaseApi } from '../BaseApi';

export class TimetableBaseApi extends BaseApi {
	constructor(path = '') {
		super(`/timetable${path}`);
	}
}
