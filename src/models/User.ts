import { apiClient } from '@/api';

enum PropertySource {
	authApi,
	userdataApi,
}

export class Property<type> {
	// Читаемое название
	public readonly name: string;

	// Источник параметра
	public readonly source: PropertySource;

	// Ссылка на пользователя
	public readonly user: UserModel;

	// Значение параметра
	private _value?: type;
	readonly readonly: boolean;
	public get value(): type | undefined {
		return this._value;
	}
	public set value(v: type) {
		if (this.readonly) {
			throw Error("Value can't be assigned");
		}
		this._value = v;
		this._changed = true;
	}
	public setValueNoAction(v: type) {
		this._value = v;
	}

	// Есть изменения, не отправленные в API
	protected _changed: boolean = false;
	public get changed() {
		return this._changed;
	}

	constructor(
		name: string,
		from: PropertySource,
		user: UserModel,
		readonly: boolean = false,
		value?: type
	) {
		this._value = value;
		this.name = name;
		this.source = from;
		this.user = user;
		this.readonly = readonly;
	}

	public async pull() {
		await this.user.pull([this]);
		return this;
	}

	public async push() {
		await this.user.push([this]);
		return this;
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
	constructor(id: number, client?: typeof apiClient, editor_user_id?: number) {
		this.id = id;
		this._client = client ?? apiClient;
		this.edit_source = editor_user_id === id ? 'user' : 'admin';
	}

	// Идентификатор пользователя
	public readonly id: number;
	public edit_source: 'user' | 'admin';

	// Настройки инстанса модели
	private readonly _client;

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

	public get properties() {
		let properties: Property<unknown>[] = [];
		properties = properties.concat(Object.values(this.auth));
		properties = properties.concat(
			Object.values(this.userdata.career),
			Object.values(this.userdata.study),
			Object.values(this.userdata.contacts),
			Object.values(this.userdata.personal)
		);
		return properties;
	}

	/**
	 * pullAuth
	 * Получаем данные из Auth API, раскидываем их на нужные поля
	 * @returns Чтобы не ждать возвращаем Promise
	 */
	private pullAuth(authApiParams: authApiRequestParamTypes[]) {
		return this._client
			.GET('/auth/user/{user_id}', {
				params: { path: { user_id: this.id }, query: { info: authApiParams } },
			})
			.then(v => {
				if (!v.data) {
					return;
				}
				if (v.data.email) {
					this.auth.email.setValueNoAction(v.data.email ?? null); // Null валидное значение, undefined невозможен
				}
				if (v.data.auth_methods) {
					this.auth.auth_methods.setValueNoAction(v.data.auth_methods);
				}
				if (v.data.groups) {
					this.auth.groups.setValueNoAction(v.data.groups);
				}
				if (v.data.indirect_groups) {
					this.auth.indirect_groups.setValueNoAction(v.data.indirect_groups);
				}
				if (v.data.user_scopes) {
					this.auth.user_scopes.setValueNoAction(v.data.user_scopes);
				}
			});
	}

	/**
	 * pullUserdata
	 * Получаем данные из Userdata API, раскидываем их на нужные поля
	 * @returns Чтобы не ждать возвращаем Promise
	 */
	private pullUserdata() {
		// Строим словарь вида {[Категория, Поле]: Проперти}
		const userdataCategoryMapping: Map<[string, string], UserdataApiProperty<unknown>> = new Map();
		Object.values(this.userdata).map(v => {
			Object.values(v).map(v => {
				userdataCategoryMapping.set([v.source_request_param, v.name], v);
			});
		});

		// Делаем запрос в userdata API
		return this._client
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
	}

	/**
	 * pull
	 * Получает множество свойств пользователя из различных API
	 */
	public pull(properties: Property<unknown>[]) {
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

		const requests: Promise<unknown>[] = [];
		if (authApiRequest) {
			requests.push(this.pullAuth(authApiParams));
		}
		if (userdataApiRequest) {
			requests.push(this.pullUserdata());
		}

		return Promise.all(requests);
	}

	private pushAuth(properties: AuthApiProperty<unknown>[]) {
		return this._client.PATCH('/auth/user/{user_id}', {
			params: { path: { user_id: this.id } },
			body: { groups: [] },
		});
	}
	private pushUserdata(properties: UserdataApiProperty<unknown>[]) {
		return this._client.POST('/userdata/user/{id}', {
			params: { path: { id: this.id } },
			body: { items: [], source: this.edit_source },
		});
	}

	/**
	 * push
	 * Засылает изменения множества свойств пользователя в различные API
	 */
	public async push(properties?: Property<unknown>[]) {
		const authApiProps: AuthApiProperty<unknown>[] = [];
		const userdataApiProps: UserdataApiProperty<unknown>[] = [];

		if (!properties) {
			properties = this.properties.filter(v => v.changed);
		}
		properties.map(v => {
			if (v instanceof AuthApiProperty) {
				authApiProps.push(v);
			}
			if (v instanceof UserdataApiProperty) {
				userdataApiProps.push(v);
			}
		});

		const requests: Promise<unknown>[] = [];
		if (authApiProps.length > 0) {
			requests.push(this.pushAuth(authApiProps));
		}
		if (userdataApiProps.length > 0) {
			requests.push(this.pushUserdata(userdataApiProps));
		}
	}
}

export default UserModel;
