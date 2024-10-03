export interface SuperappAuthItem {
	service_id: number;
	current_scopes?: string[];
	token?: string | null;
	expires?: string | null;
}
