import apiClient from '@/api';

export type apiError = {
	status: string;
	message: string;
	ru: string;
};

interface ErrorInfo {
	url: string;
	status: number;
	message: string;
}

export function recordError(url: string, status: number, error: apiError | undefined) {
	if (error) {
		const errorInfo: ErrorInfo = {
			url,
			status,
			message: error.message,
		};
		apiClient.POST('/marketing/v1/action', {
			body: {
				action: 'error',
				additional_data: JSON.stringify(errorInfo),
			},
		});
	}
}
