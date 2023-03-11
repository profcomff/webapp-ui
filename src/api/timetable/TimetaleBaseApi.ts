import { BaseApi } from '../BaseApi';

export class TimetableBaseApi extends BaseApi {
	constructor() {
		super(import.meta.env.VITE_APP_API_TIMETABLE);
	}
}
