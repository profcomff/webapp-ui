import Client from 'openapi-fetch';
import { http, HttpResponse } from 'msw';
import { UserModel } from '@/models/User'; // Инициализированный здесь apiClient нужно перенести на после создания msw
import { afterEach, beforeAll, afterAll, expect, test } from 'vitest';
import { setupServer } from 'msw/node';
import { paths } from '@profcomff/api-uilib';

export const server = setupServer();

beforeAll(() => {
	server.listen({
		onUnhandledRequest: request => {
			throw new Error(`No request handler found for ${request.method} ${request.url}`);
		},
	});
});

afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Get basic info from Auth API with hardload', async () => {
	const baseUrl = import.meta.env.VITE_API_URL;

	const rawData = {
		id: 1,
		email: 'hello@world.com',
	};

	server.use(http.get(`${baseUrl}/auth/user/1`, () => HttpResponse.json(rawData, { status: 200 })));
	const testClient = Client<paths>({ baseUrl });

	const user = new UserModel(1, testClient);
	await user.pull([user.auth.email]);
	expect(user.auth.email.value).toBe('hello@world.com');
});
