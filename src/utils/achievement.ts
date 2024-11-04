export function getPictureUrl(picUrl: string | null) {
	return import.meta.env.VITE_API_URL + '/achievement/' + picUrl;
}
