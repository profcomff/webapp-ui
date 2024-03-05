import { ArrayResponse, Lecturer } from '../../models';
import { LecturerBaseApi } from './LecturerBaseApi';

type PatchLecturerBody = Omit<Lecturer, 'id' | 'avatar_link'>;

type CreateLecturerBody = Pick<
	Lecturer,
	'first_name' | 'middle_name' | 'last_name' | 'description'
>;

export interface GetLecturersParams {
	query?: string;
	limit?: number;
	offset?: number;
}

class LecturerApi extends LecturerBaseApi {
	constructor() {
		super();
	}

	public getLecturer(id: number) {
		return this.get<Lecturer>(`/${id}`);
	}

	public deleteLecturer(id: number) {
		return this.delete<string>(`/${id}`);
	}

	public patchLecturer(id: number, body: PatchLecturerBody) {
		return this.patch<Lecturer, PatchLecturerBody>(`/${id}`, body);
	}

	public getLecturers(params?: GetLecturersParams) {
		return this.get<ArrayResponse<Lecturer>, GetLecturersParams>('', params);
	}

	public createLecturer(lecturer: CreateLecturerBody) {
		return this.post<Lecturer, CreateLecturerBody>('', lecturer);
	}
}

export const timetableLecturerApi = new LecturerApi();
