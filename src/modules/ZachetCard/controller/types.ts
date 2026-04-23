export interface UserdataItem {
	category: string;
	param: string;
	value?: string | null;
}

export interface UserdataResponse {
	items: UserdataItem[];
}

export interface ZachetCardData {
	unionCardNumber: string;
	fullNameRu: string;
	fullNameEn: string;
	birthDate: string;
	facultyRu: string;
	facultyEn: string;
	statusRu: string;
	statusEn: string;
	photoUrl?: string;
}
