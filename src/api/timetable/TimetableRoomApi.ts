import { GetAllParams } from '../EntityBaseApi';
import { Room } from './../models';
import { TimetableEntityBaseApi } from './TimetaableEntityBaseApi';

export interface GetRoomsParams extends GetAllParams {
	query?: string;
}

class TimetableRoomApi extends TimetableEntityBaseApi<Room, GetRoomsParams> {
	constructor() {
		super('/room');
	}
}

export const timetableRoomApi = new TimetableRoomApi();
