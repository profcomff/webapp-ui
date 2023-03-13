import { AxiosError } from 'axios';
import { BaseApi } from '../BaseApi';

export class AuthBaseApi extends BaseApi {
	constructor(path: string = '') {
		super(`/auth${path}`);
	}
}

interface ErrorResponse {
	status: string;
	message: string;
}

interface NoLinkedAccoutErrorResponse extends ErrorResponse {
	id_token: string;
}
export type NoLinkedAccountError = AxiosError<NoLinkedAccoutErrorResponse>;

export type ExternalAuthorizationError = AxiosError<ErrorResponse>;

export type UserExistsError = AxiosError<ErrorResponse>;
