export type ApiError = {
	status: string;
	message: string;
	ru: string;
};

export interface ErrorInfo {
	url: string;
	status: number;
	message: string;
}
