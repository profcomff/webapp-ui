import { Event } from '../models';
import { GetAllParams } from '../EntityBaseApi';
import { TimetableEntityBaseApi } from './TimetaableEntityBaseApi';

type ModifyEventBody = Pick<Event, 'name' | 'start_ts' | 'end_ts'> & {
	room_id: number[];
	group_id: number;
	lecturer_id: number[];
};

export interface GetEventsParams extends GetAllParams {
	start?: string; // format: 2023-12-30
	end?: string; // format: 2023-12-31
	group_id?: number;
	lecturer_id?: number;
	room_id?: number;
	detail?: Array<'comment' | 'description'>;
	format?: 'json' | 'ics';
}

class TimetableEventApi extends TimetableEntityBaseApi<Event, GetEventsParams, ModifyEventBody, never> {
	constructor() {
		super('/event');
	}
}

export const timetableEventApi = new TimetableEventApi();
