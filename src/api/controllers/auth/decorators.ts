/* eslint-disable @typescript-eslint/no-explicit-any */
import { userSessionApi } from '@/api/auth';
import { ToastType } from '@/models';
import { useProfileStore, useToastStore } from '@/store';
import axios from 'axios';
import { R } from 'vitest/dist/types-198fd1d9';
import { useRouter } from 'vue-router';

export function scoped<Resp>(method: (...args: any[]) => Resp, scopeName: string) {
	return (...args: any[]) => {
		const { hasTokenAccess } = useProfileStore();
		const toastStore = useToastStore();

		if (hasTokenAccess(scopeName)) {
			return method(...args);
		} else {
			toastStore.push({
				title: `У вас нет доступа к методу ${method.name}`,
				type: ToastType.Error,
			});
		}
	};
}

export function showErrorToast<Resp>(method: (...args: any[]) => Resp) {
	return async (...args: any[]) => {
		const toastStore = useToastStore();
		try {
			const response = await method(...args);
			return response;
		} catch (err) {
			if (axios.isAxiosError(err)) {
				toastStore.push({
					title: err.response?.data.message,
					type: ToastType.Error,
				});
			} else {
				toastStore.push({
					title: 'Неизвестная ошибка',
					description: err instanceof Error ? err.message : '',
					type: ToastType.Error,
				});
			}
		}
	};
}

export function checkToken<Resp>(method: (...args: any[]) => Resp) {
	return async (...args: any[]) => {
		const router = useRouter();
		const toastStore = useToastStore();
		const { deleteToken } = useProfileStore();
		try {
			await userSessionApi.getMe();
			const response = await method(...args);
			return response;
		} catch (error) {
			if (axios.isAxiosError(error) && error.status === 403) {
				deleteToken();
				router.push('/auth');
				toastStore.push({ title: 'Сессия истекла' });
			}
		}
	};
}

type Func<Resp> = (...args: any[]) => Resp | undefined | any;
// type AsyncFunc<Resp> = (...args: any[]) => Promise<Resp | undefined>;
type Decorator<Resp = undefined> = (method: Func<Resp>, ...args: any[]) => Func<Resp | undefined>;
type DecoratorResp<D extends Decorator> = D extends Decorator<R> ? R : never;
type DecoratorTuple<D extends Decorator, Resp> = [Decorator<Resp | undefined>, ...Omit<Parameters<D>, 0>];

export function apply<Resp>(method: Func<Resp>, ...decoratorTuples: DecoratorTuple<Decorator, Resp>[]) {
	if (decoratorTuples.length === 0) {
		return method;
	} else {
		const decoratorTuple = decoratorTuples.shift()!;
		return apply(decoratorTuple[0](method, ...decoratorTuple), ...decoratorTuples);
	}
}
