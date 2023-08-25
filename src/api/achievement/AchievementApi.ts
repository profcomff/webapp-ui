import { BaseApi } from '../BaseApi';

interface AchievementCreate {
	name: string;
	description: string;
}
interface Reciever {
	user_id: number;
}
export interface AchievementGet {
	id: number;
	name: string;
	description: string;
	picture: string | undefined;
	owner_user_id: number;
	recievers: Reciever[] | undefined;
}
interface AchievementEdit {
	name?: string | null;
	description?: string | null;
}
export interface UserAchievementsGet {
	id: number;
	achievement: AchievementGet[];
}

class AchievementApi extends BaseApi {
	constructor() {
		super('/achievement');
	}

	public async create(name: string, description: string, picture: File) {
		const form = new FormData();
		form.append('picture_file', picture);

		return this.post<AchievementGet, AchievementCreate>('/achievement', { name, description }).then(resp =>
			this.patch<AchievementGet, FormData>(`/achievement/${resp.data.id}/picture`, form),
		);
	}

	public async edit(id: number, edit: AchievementEdit) {
		return this.patch<AchievementGet, AchievementEdit>(`/achievement/${id}`, edit);
	}

	public async getAll() {
		return this.get<AchievementGet[]>('/achievement');
	}

	public async getOne(id: number) {
		return this.get<AchievementGet>(`/achievement/${id}`);
	}

	public async getRecievers(id: number) {
		return this.get<AchievementGet>(`/achievement/${id}/reciever`);
	}

	public async revoke(user_id: number, achievement_id: number) {
		return this.delete<AchievementGet>(`/achievement/${achievement_id}/reciever/${user_id}`);
	}

	public async give(user_id: number, achievement_id: number) {
		return this.post<AchievementGet>(`/achievement/${achievement_id}/reciever/${user_id}`);
	}

	public async getUser(id: number) {
		return this.get<UserAchievementsGet>(`/user/${id}`);
	}

	public getPictureUrl(picture: string | undefined) {
		return import.meta.env.VITE_API_URL + '/achievement/' + picture;
	}
}

export const achievementApi = new AchievementApi();
