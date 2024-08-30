export * from './controllers';
import { recordError } from '@/utils/errorHandler';
import { createClient } from '@profcomff/api-uilib';
import { type Middleware } from 'openapi-fetch';

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

const apiClient = createClient(import.meta.env.VITE_API_URL);
apiClient.use(errorMiddleware);
export default apiClient;
