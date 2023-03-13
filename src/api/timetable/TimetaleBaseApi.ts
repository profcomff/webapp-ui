import { BaseApi } from '../BaseApi';

export class TimetableBaseApi extends BaseApi {
	constructor(path: string = '') {
		super(`/timetable${path}`);
	}
}
