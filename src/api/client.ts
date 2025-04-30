import { createClient } from '@profcomff/api-uilib';
import { type Middleware } from 'openapi-fetch';
import { ApiError, ErrorInfo } from './types';

function recordError(url: string, status: number, error: ApiError | undefined) {
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

const errorMiddleware: Middleware = {
	async onResponse({ response }) {
		const data = await response.clone();
		if (!response.ok) {
			const error = await data.json();
			recordError(response.url, response.status, await error);
			return undefined;
		}
		return response;
	},
};

export const apiClient = createClient(import.meta.env.VITE_API_URL);
apiClient.use(errorMiddleware);
