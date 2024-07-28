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

test('Get basic info from Auth API', async () => {
	const baseUrl = import.meta.env.VITE_API_URL;

	const rawData = {
		id: 1,
		email: 'hello@world.com',
		auth_methods: null,
		session_scopes: null,
		user_scopes: null,
		indirect_groups: null,
		groups: null,
	};

	server.use(http.get(`${baseUrl}/auth/user/1`, () => HttpResponse.json(rawData, { status: 200 })));
	const testClient = Client<paths>({ baseUrl });

	const user = new UserModel(1, testClient);
	await user.pull([user.auth.email]);
	expect(user.auth.email.value).toBe('hello@world.com');
	expect(user.auth.auth_methods.value).toBeUndefined();
	expect(user.auth.user_scopes.value).toBeUndefined();
	expect(user.auth.indirect_groups.value).toBeUndefined();
	expect(user.auth.groups.value).toBeUndefined();
});

test('Get some info from Auth API', async () => {
	const baseUrl = import.meta.env.VITE_API_URL;

	const rawData = {
		id: 1,
		email: 'hello@world.com',
		auth_methods: ['email', 'vk'],
		session_scopes: null,
		user_scopes: null,
		indirect_groups: null,
		groups: null,
	};

	server.use(http.get(`${baseUrl}/auth/user/1`, () => HttpResponse.json(rawData, { status: 200 })));
	const testClient = Client<paths>({ baseUrl });

	const user = new UserModel(1, testClient);
	await user.pull([user.auth.email, user.auth.auth_methods]);
	expect(user.auth.email.value).toBe('hello@world.com');
	expect(user.auth.auth_methods.value).length(2).contains('email').contains('vk');
	expect(user.auth.user_scopes.value).toBeUndefined();
	expect(user.auth.indirect_groups.value).toBeUndefined();
	expect(user.auth.groups.value).toBeUndefined();
});

test('Get all info from Auth API', async () => {
	const baseUrl = import.meta.env.VITE_API_URL;

	const rawData = {
		auth_methods: ['airflow_outer_auth', 'coder_outer_auth', 'email', 'github_auth', 'google_auth'],
		session_scopes: null,
		user_scopes: [
			{
				id: 61,
				name: 'pinger.metric.create',
			},
			{
				id: 107,
				name: 'userdata.category.personal.write',
			},
		],
		indirect_groups: [7, 5, 10, 4, 6, 23, 11, 17, 9, 2],
		groups: [5, 6, 4, 11, 17, 9, 23],
		id: 1,
		email: 'hello@world.com',
	};

	server.use(http.get(`${baseUrl}/auth/user/1`, () => HttpResponse.json(rawData, { status: 200 })));
	const testClient = Client<paths>({ baseUrl });

	const user = new UserModel(1, testClient);
	await user.pull([user.auth.email, user.auth.auth_methods]);
	expect(user.auth.email.value).toBe('hello@world.com');
	expect(user.auth.auth_methods.value)
		.length(5)
		.contains('airflow_outer_auth')
		.contains('coder_outer_auth')
		.contains('email')
		.contains('github_auth')
		.contains('google_auth');
	expect(user.auth.groups.value)
		.length(7)
		.contains(4)
		.contains(5)
		.contains(6)
		.contains(9)
		.contains(11)
		.contains(17)
		.contains(23);
	expect(user.auth.indirect_groups.value)
		.length(10)
		.contains(7)
		.contains(5)
		.contains(10)
		.contains(4)
		.contains(6)
		.contains(23)
		.contains(11)
		.contains(17)
		.contains(9)
		.contains(2);
});
