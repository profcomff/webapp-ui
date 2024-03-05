import { TimetableBaseApi } from './../TimetaleBaseApi';

export class LecturerBaseApi extends TimetableBaseApi {
	constructor() {
		super('/lecturer');
	}
}
