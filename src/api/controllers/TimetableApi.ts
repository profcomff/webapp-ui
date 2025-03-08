import { stringifyDate, getDateWithDayOffset } from './../../utils/date';
import { useTimetableStore } from './../../store/timetable';
import { apiClient } from '../client';

interface GetLecturersParams {
	query?: string;
	limit?: number;
	offset?: number;
}

interface GetEventsParams {
	limit?: number;
	offset?: number;
	start?: string; // format: 2023-12-30
	end?: string; // format: 2023-12-31
	group_id?: number;
	lecturer_id?: number;
	room_id?: number;
	detail?: Array<'comment' | 'description'>;
	format?: 'json' | 'ics';
}

function getLecturer(id: number) {
	return apiClient.GET('/timetable/lecturer/{id}', {
		params: { path: { id } },
	});
}

function getLecturers(params?: GetLecturersParams) {
	return apiClient.GET('/timetable/lecturer/', {
		params: { query: params },
	});
}

export class TimetableApi {
	public static async getLecturer(id: number) {
		const { setLecturers } = useTimetableStore();
		const { data } = await getLecturer(id);
		if (data) {
			setLecturers([data]);
		}
	}

	public static async getLecturers() {
		const { setLecturers } = useTimetableStore();
		const { data } = await getLecturers();
		if (data) {
			setLecturers(data.items);
		}
	}

	public static async getRoom(id: number) {
		const { setRooms } = useTimetableStore();
		const { data } = await apiClient.GET('/timetable/room/{id}', {
			params: { path: { id } },
		});
		if (data) {
			setRooms([data]);
		}
	}

	public static async getRooms() {
		const { setRooms } = useTimetableStore();
		const { data } = await apiClient.GET('/timetable/room/');
		if (data) {
			setRooms(data.items);
		}
	}

	public static async getEvent(id: number) {
		const { setEvents } = useTimetableStore();
		const { data } = await apiClient.GET('/timetable/event/{id}', {
			params: { path: { id } },
		});
		if (data) {
			setEvents([data]);
		}
	}

	public static async getEvents(params?: GetEventsParams) {
		const { setEvents } = useTimetableStore();
		const { data } = await apiClient.GET('/timetable/event/', {
			params: { query: params },
		});
		if (data && data !== null) {
			setEvents(data.items);
		}
	}

	public static async getDayEvents(date: Date, groupId: number) {
		const { setDay } = useTimetableStore();
		const { data } = await apiClient.GET('/timetable/event/', {
			params: {
				query: {
					start: stringifyDate(date),
					end: stringifyDate(getDateWithDayOffset(date, 1)),
					group_id: groupId,
				},
			},
		});
		if (data && data !== null) {
			setDay(date, data.items);
		}
	}

	public static async getLecturerEvents(lecturerId: number) {
		const { setLecturerEvents, setLecturers } = useTimetableStore();
		const { data } = await apiClient.GET('/timetable/event/', {
			params: {
				query: {
					start: stringifyDate(new Date()),
					end: stringifyDate(getDateWithDayOffset(new Date(), 1)),
					lecturer_id: lecturerId,
				},
			},
		});
		if (data?.items.length) {
			setLecturers(data.items[0].lecturer);
			setLecturerEvents(lecturerId, data.items);
		}
	}

	public static async getRoomEvents(roomId: number) {
		const { setRoomEvents, setRooms } = useTimetableStore();
		const { data } = await apiClient.GET('/timetable/event/', {
			params: {
				query: {
					start: stringifyDate(new Date()),
					end: stringifyDate(getDateWithDayOffset(new Date(), 1)),
					room_id: roomId,
				},
			},
		});
		if (data?.items.length) {
			setRooms(data.items[0].room);
			setRoomEvents(roomId, data.items);
		}
	}
}
