import { AxiosError } from 'axios';
import { BaseApi } from '../BaseApi';

export class AuthBaseApi extends BaseApi {
	constructor(path = '') {
		super(`/auth${path}`);
	}
}

export interface DefaultResponse {
	status: string;
	message: string;
}

interface NoLinkedAccoutErrorResponse extends DefaultResponse {
	id_token: string;
}
export type NoLinkedAccountError = AxiosError<NoLinkedAccoutErrorResponse>;

export type ExternalAuthorizationError = AxiosError<DefaultResponse>;

export type UserExistsError = AxiosError<DefaultResponse>;
