import { ArrayResponse, Room } from './../models';
import { TimetableBaseApi } from './TimetaleBaseApi';

type RoomWithoutId = Omit<Room, 'id'>;

export interface GetRoomsParams {
	query?: string;
	limit?: number;
	offset?: number;
}

class TimetableRoomApi extends TimetableBaseApi {
	constructor() {
		super('/room');
	}

	public async getRoom(id: number) {
		return this.get<Room>(`/${id}`);
	}

	public async deleteRoom(id: number) {
		return this.delete<string>(`/${id}`);
	}

	public async patchRoom(id: number, body: RoomWithoutId) {
		return this.patch<Room, RoomWithoutId>(`/${id}`, body);
	}

	public async getRooms(params?: GetRoomsParams) {
		return this.get<ArrayResponse<Room>, GetRoomsParams>('', params);
	}

	public async createRoom(room: RoomWithoutId) {
		return this.post<Room, RoomWithoutId>('', room);
	}
}

export const timetableRoomApi = new TimetableRoomApi();
