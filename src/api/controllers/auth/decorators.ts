/* eslint-disable @typescript-eslint/no-explicit-any */
import { userSessionApi } from '@/api/auth';
import { ToastType } from '@/models';
import router from '@/router';
import { useProfileStore } from '@/store/profile';
import { useToastStore } from '@/store/toast';
import axios from 'axios';

export type Func<R = any, FuncArgs extends any[] = any[]> = (...args: FuncArgs) => R;
type Decorator<F extends Func = Func, DecoratorArgs extends any[] = any[]> = Func<
	F,
	[F, ...DecoratorArgs]
>;
type DecoratorTuple<D extends Decorator = Decorator> = [
	D,
	...(D extends Decorator<Func, infer DA> ? DA : never)
];

export function scoped<F extends Func>(
	method: F,
	scope: string
): Func<ReturnType<F>, Parameters<F>> {
	return (...args) => {
		const { hasTokenAccess } = useProfileStore();
		const toastStore = useToastStore();

		if (hasTokenAccess(scope)) {
			return method(...args);
		}

		toastStore.push({
			title: `У вас нет доступа к методу ${method.name}`,
			type: ToastType.Error
		});
	};
}

export function showErrorToast<F extends Func>(
	method: F
): Func<Promise<ReturnType<F>>, Parameters<F>> {
	return async (...args: any[]) => {
		const toastStore = useToastStore();
		try {
			const response = await method(...args);
			return response;
		} catch (err) {
			if (axios.isAxiosError(err)) {
				toastStore.push({
					title: err.response?.data.message,
					type: ToastType.Error
				});
			} else {
				toastStore.push({
					title: 'Неизвестная ошибка',
					description: err instanceof Error ? err.message : '',
					type: ToastType.Error
				});
			}
		}
	};
}

export function checkToken<F extends Func<any, any>>(
	method: F
): Func<Promise<ReturnType<F>>, Parameters<F>> {
	return async (...args: any[]) => {
		try {
			await userSessionApi.getMe();
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 403) {
				const { deleteToken } = useProfileStore();
				const toastStore = useToastStore();
				deleteToken();
				router.push('/auth');
				toastStore.push({ title: 'Сессия истекла' });
			}
		}
		const response = await method(...args);
		return response;
	};
}

export function apply<F extends Func>(
	method: F,
	...decoratorTuples: DecoratorTuple[]
): Func<ReturnType<F>, Parameters<F>> {
	if (decoratorTuples.length) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const decoratorTuple = decoratorTuples.shift()!;
		const decorator = decoratorTuple[0];
		const args = decoratorTuple.slice(1) as unknown[];
		return apply(decorator(method, ...args), ...decoratorTuples);
	}
	return method;
}
