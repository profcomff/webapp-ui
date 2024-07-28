import { apiClient } from '@/api';

enum PropertySource {
	authApi,
	userdataApi,
}

export class Property<type> {
	// Читаемое название
	private _name: string;

	// Значение параметра
	private _value?: type;

	// Источник параметра
	private _source: PropertySource;

	// Ссылка на пользователя
	private _user: UserModel;

	// Есть изменения, не отправленные в API
	protected _changed: boolean = false;

	constructor(name: string, from: PropertySource, user: UserModel, value?: type) {
		this._name = name;
		this._value = value;
		this._source = from;
		this._user = user;
	}

	public get name(): string {
		return this._name;
	}

	public get value(): type | undefined {
		if ((this._value === undefined && this.user.autoPull) || this.user.alwaysRefresh) {
			this.user.pull([this]);
		}
		return this._value;
	}
	public set value(v: type) {
		this._value = v;
		this._changed = true;
		if ((this._value !== undefined && this.user.autoPush) || this.user.alwaysRefresh) {
			this.user.push([this]);
		}
	}
	public setValueNoAction(v: type) {
		this._value = v;
	}

	public get source() {
		return this._source;
	}

	public get user() {
		return this._user;
	}
}

type authApiRequestParamTypes = 'auth_methods' | 'groups' | 'indirect_groups' | 'scopes';
class AuthApiProperty<type> extends Property<type> {
	private _source_request_param: authApiRequestParamTypes | null;

	constructor(
		name: string,
		request_param: authApiRequestParamTypes | null,
		user: UserModel,
		value?: type
	) {
		super(name, PropertySource.authApi, user, value);
		this._source_request_param = request_param ?? null;
	}

	public get source_request_param() {
		return this._source_request_param;
	}
}

type userdataApiRequestParamTypes = 'Учёба' | 'Карьера' | 'Контакты' | 'Личная информация';
class UserdataApiProperty<type> extends Property<type> {
	private _source_request_param: userdataApiRequestParamTypes;

	constructor(
		name: string,
		request_param: userdataApiRequestParamTypes,
		user: UserModel,
		value?: type
	) {
		super(name, PropertySource.userdataApi, user, value);
		this._source_request_param = request_param;
	}

	public get source_request_param() {
		return this._source_request_param;
	}
}

export class UserModel {
	constructor(id: number) {
		this._id = id;
	}

	// Идентификатор пользователя
	private _id: number;
	public get id() {
		return this._id;
	}

	// Настройки инстанса модели
	private _autoPull = true;
	public get autoPull() {
		return this._autoPull;
	}

	private _autoPush = true;
	public get autoPush() {
		return this._autoPush;
	}

	private _alwaysRefresh = false;
	public get alwaysRefresh() {
		return this._alwaysRefresh;
	}

	// Свойства
	public auth = {
		id: new AuthApiProperty<number>('id', null, this),
		email: new AuthApiProperty<string | null>('Электронная почта', null, this),
		auth_methods: new AuthApiProperty<string[]>('Методы авторизации', 'auth_methods', this),
		groups: new AuthApiProperty<number[]>('Группы', 'groups', this),
		indirect_groups: new AuthApiProperty<number[]>('Все группы', 'indirect_groups', this),
		user_scopes: new AuthApiProperty<{ id: number; name: string }[]>(
			'Права доступа',
			'scopes',
			this
		),
	};
	public userdata = {
		career: {
			work: new UserdataApiProperty<string>('Место работы', 'Карьера', this),
		},
		personal: {
			birthday: new UserdataApiProperty<string>('Дата рождения', 'Личная информация', this),
			sex: new UserdataApiProperty<string>('Пол', 'Личная информация', this),
			full_name: new UserdataApiProperty<string>('Полное имя', 'Личная информация', this),
			photo: new UserdataApiProperty<string>('Фото', 'Личная информация', this),
		},
		contacts: {
			born_city: new UserdataApiProperty<string>('Родной город', 'Контакты', this),
			city: new UserdataApiProperty<string>('Город', 'Контакты', this),
			location: new UserdataApiProperty<string>('Место жительства', 'Контакты', this),
			github: new UserdataApiProperty<string>('Имя пользователя GitHub', 'Контакты', this),
			vk: new UserdataApiProperty<string>('Имя пользователя VK', 'Контакты', this),
			phone: new UserdataApiProperty<string>('Номер телефон', 'Контакты', this),
			email: new UserdataApiProperty<string>('Электронная почта', 'Контакты', this),
		},
		study: {
			university: new UserdataApiProperty<string>('ВУЗ', 'Учёба', this),
			department: new UserdataApiProperty<string>('Факультет', 'Учёба', this),
		},
	};

	/**
	 * makeAuthRequest
	 * Получаем данные из Auth API, раскидываем их на нужные поля
	 * @returns Чтобы не ждать возвращаем Promise
	 */
	private pullAuth = (authApiParams: authApiRequestParamTypes[]) => {
		return apiClient
			.GET('/auth/user/{user_id}', {
				params: { path: { user_id: this.id }, query: { info: authApiParams } },
			})
			.then(v => {
				if (v.data && v.data.email) {
					this.auth.email.setValueNoAction(v.data.email);
				}
				if (v.data && v.data.auth_methods) {
					this.auth.auth_methods.setValueNoAction(v.data.auth_methods);
				}
				if (v.data && v.data.groups) {
					this.auth.groups.setValueNoAction(v.data.groups);
				}
				if (v.data && v.data.indirect_groups) {
					this.auth.indirect_groups.setValueNoAction(v.data.indirect_groups);
				}
				if (v.data && v.data.user_scopes) {
					this.auth.user_scopes.setValueNoAction(v.data.user_scopes);
				}
			});
	};

	/**
	 * makeUserdataRequest
	 * Получаем данные из Userdata API, раскидываем их на нужные поля
	 * @returns Чтобы не ждать возвращаем Promise
	 */
	private pullUserdata = () => {
		// Строим словарь вида {[Категория, Поле]: Проперти}
		const userdataCategoryMapping: Map<[string, string], UserdataApiProperty<unknown>> = new Map();
		Object.values(this.userdata).map(v => {
			Object.values(v).map(v => {
				userdataCategoryMapping.set([v.source_request_param, v.name], v);
			});
		});

		// Делаем запрос в userdata API
		return apiClient
			.GET('/userdata/user/{id}', {
				params: { path: { id: this.id } },
			})
			.then(v => {
				if (v.data && v.data.items) {
					// Для каждого элемента ищем в словаре категорию+поле и заполняем
					v.data.items.forEach(v => {
						if (v.value && userdataCategoryMapping.has([v.category, v.param])) {
							userdataCategoryMapping.get([v.category, v.param])?.setValueNoAction(v.value);
						}
					});
				}
			});
	};

	/**
	 * pull
	 * Получает множество свойств пользователя из различных API
	 */
	public pull = (properties: Property<unknown>[]) => {
		let authApiRequest = false;
		const authApiParams: authApiRequestParamTypes[] = [];

		let userdataApiRequest = false;

		properties.forEach(v => {
			if (v instanceof AuthApiProperty) {
				authApiRequest = true;
				if (v.source_request_param && !authApiParams.includes(v.source_request_param)) {
					authApiParams.push(v.source_request_param);
				}
			}
			if (v instanceof UserdataApiProperty) {
				userdataApiRequest = true;
			}
		});

		const requests: Promise<void>[] = [];
		if (authApiRequest) {
			requests.push(this.pullAuth(authApiParams));
		}
		if (userdataApiRequest) {
			requests.push(this.pullUserdata());
		}

		return Promise.all(requests);
	};

	private pushAuth = () => {};
	private pushUserdata = () => {};

	/**
	 * push
	 * Засылает изменения множества свойств пользователя в различные API
	 */
	public push = async (properties?: Property<unknown>[]) => {
		// let authApiRequest: AuthApiProperty<unknown>[] = [];
		// let userdataApiRequest: UserdataApiProperty<unknown>[] = [];

		if (!properties) {
			// Собираем все неизмененные проперти
		} else {
			// Сортируем только перечисленные
		}
	};

	/**
	 * lazyLoadSetup
	 * Устанавливает настройки ленивой загрузки и отправки данных
	 * Позволяет установить с какой частотой будут получаться/отправляться изменения на сервер
	 * @param autoPull Разрешить получать данные при образении к параметрам.
	 * 	Если false – получение только через `User.pull(...)`.
	 * @param autoPush Разрешить сохранять данные при образении к параметрам.
	 * 	Если false – сохранение только через `User.push(...)`.
	 * @param alwaysRefresh – не кэшировать значения и делать запросы на сервер каждый раз.
	 */
	public lazyLoadSetup = async (
		autoPull: boolean = true,
		autoPush: boolean = true,
		alwaysRefresh: boolean = false
	) => {
		this._autoPull = autoPull;
		this._autoPush = autoPush;
		this._alwaysRefresh = alwaysRefresh;
	};
}

export default UserModel;
