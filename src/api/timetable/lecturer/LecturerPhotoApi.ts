import { LecturerBaseApi } from './LecturerBaseApi';

interface UploadPhotoResposne {
	id: number;
	lecturer_id: number;
	link: string;
}

class LecturerPhotoApi extends LecturerBaseApi {
	constructor() {
		super();
	}

	public async uploadPhoto(lecturerId: number, formData: FormData) {
		this.post<UploadPhotoResposne, FormData>(`/${lecturerId}/photo`, formData, {
			'Content-type': 'multipart/form-data',
		});
	}
}

export const timetableLecturerPhotoApi = new LecturerPhotoApi();
