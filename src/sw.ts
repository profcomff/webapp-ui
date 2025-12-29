/// <reference lib="webworker" />
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { clientsClaim } from 'workbox-core';
import type { WorkboxPlugin } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

type PrecacheEntry = { url: string; revision?: string };

declare const self: ServiceWorkerGlobalScope & {
	__WB_MANIFEST: PrecacheEntry[];
};

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
clientsClaim();

self.addEventListener('message', (event) => {
	if (event.data?.type === 'SKIP_WAITING') {
		void self.skipWaiting();
	}
});

registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')));

const notifyTimetableCacheInvalid = async (requestUrl: string) => {
	const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
	for (const client of clients) {
		client.postMessage({ type: 'timetable-cache-invalid', url: requestUrl });
	}
};

const timetableHashCacheName = 'api-timetable-meta';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const bufferToHex = (buffer: ArrayBuffer) =>
	Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, '0')).join('');

const hashString = async (value: string) => {
	const buffer = new TextEncoder().encode(value);
	const digest = await crypto.subtle.digest('SHA-256', buffer);
	return bufferToHex(digest);
};

const getItemId = (value: JsonValue) => {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return null;
	}
	const idValue = (value as Record<string, JsonValue>).id;
	return typeof idValue === 'number' ? idValue : null;
};

const compareById = (a: JsonValue, b: JsonValue) => {
	const aId = getItemId(a);
	const bId = getItemId(b);
	if (aId === null && bId === null) {
		return 0;
	}
	if (aId === null) {
		return 1;
	}
	if (bId === null) {
		return -1;
	}
	return aId - bId;
};

const normalizeJson = (value: JsonValue, parentKey?: string): JsonValue => {
	if (Array.isArray(value)) {
		const normalizedItems = value.map(item => normalizeJson(item));
		if (parentKey === 'group' || parentKey === 'lecturer' || parentKey === 'room') {
			return normalizedItems.slice().sort(compareById);
		}
		return normalizedItems;
	}
	if (value && typeof value === 'object') {
		const obj = value as Record<string, JsonValue>;
		const normalized: Record<string, JsonValue> = {};
		for (const key of Object.keys(obj).sort()) {
			normalized[key] = normalizeJson(obj[key], key);
		}
		return normalized;
	}
	return value;
};

const normalizeTimetableJsonText = (text: string) => {
	try {
		const data = JSON.parse(text) as JsonValue;
		return JSON.stringify(normalizeJson(data));
	} catch {
		return null;
	}
};

const hashResponseBody = async (response: Response) => {
	const contentType = response.headers.get('content-type') ?? '';
	if (contentType.includes('application/json')) {
		const normalized = normalizeTimetableJsonText(await response.clone().text());
		if (normalized) {
			return hashString(normalized);
		}
	}
	const buffer = await response.arrayBuffer();
	const digest = await crypto.subtle.digest('SHA-256', buffer);
	return bufferToHex(digest);
};

const getHashCacheKey = (request: Request) => new Request(request.url);

const readTimetableHash = async (request: Request) => {
	const metaCache = await caches.open(timetableHashCacheName);
	const cachedHashResponse = await metaCache.match(getHashCacheKey(request));
	if (!cachedHashResponse) {
		return null;
	}
	return cachedHashResponse.text();
};

const writeTimetableHash = async (request: Request, hash: string) => {
	const metaCache = await caches.open(timetableHashCacheName);
	await metaCache.put(
		getHashCacheKey(request),
		new Response(hash, { headers: { 'content-type': 'text/plain' } }),
	);
};

const getTimetableHash = async (request: Request, cachedResponse: Response) => {
	try {
		const cachedHash = await readTimetableHash(request);
		if (cachedHash) {
			return cachedHash;
		}
		const hash = await hashResponseBody(cachedResponse.clone());
		await writeTimetableHash(request, hash);
		return hash;
	} catch {
		return null;
	}
};

const cacheInvalidTracker: WorkboxPlugin = {
	async cachedResponseWillBeUsed({ request, cachedResponse, state }) {
		if (cachedResponse && state) {
			state.cachedHashPromise = getTimetableHash(request, cachedResponse);
		}
		return cachedResponse;
	},
	async fetchDidSucceed({ request, response, state }) {
		if (response.status !== 0 && response.status !== 200) {
			return response;
		}
		let networkHash: string | null = null;
		try {
			networkHash = await hashResponseBody(response.clone());
			if (state) {
				state.latestNetworkHash = networkHash;
			}
		} catch {
			
		}
		const cachedHashPromise = state?.cachedHashPromise as Promise<string | null> | undefined;
		if (cachedHashPromise) {
			const cachedHash = await cachedHashPromise;
			if (cachedHash && networkHash && cachedHash !== networkHash) {
				void notifyTimetableCacheInvalid(request.url);
			}
		}
		return response;
	},
	async cacheDidUpdate({ request, state }) {
		try {
			const existingHash = state?.latestNetworkHash;
			if (typeof existingHash !== 'string') {
				return;
			}
			await writeTimetableHash(request, existingHash);
		} catch {
			
		}
	},
};

registerRoute(
	/^https:\/\/api(?:\.test)?\.profcomff\.com\/timetable\/.*/i,
	new StaleWhileRevalidate({
		cacheName: 'api-timetable',
		plugins: [
			new ExpirationPlugin({
				maxEntries: 30,
				maxAgeSeconds: 60 * 60 * 24 * 30,
			}),
			new CacheableResponsePlugin({
				statuses: [0, 200],
			}),
			cacheInvalidTracker,
		],
	}),
);

registerRoute(
	/^https:\/\/fonts\.googleapis\.com\/.*/i,
	new StaleWhileRevalidate({
		cacheName: 'google-fonts-stylesheets',
	}),
);

registerRoute(
	/^https:\/\/fonts\.gstatic\.com\/.*/i,
	new CacheFirst({
		cacheName: 'google-fonts-webfonts',
		plugins: [
			new ExpirationPlugin({
				maxEntries: 30,
				maxAgeSeconds: 60 * 60 * 24 * 365,
			}),
			new CacheableResponsePlugin({
				statuses: [0, 200],
			}),
		],
	}),
);
