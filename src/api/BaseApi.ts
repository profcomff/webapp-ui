import axios, { AxiosResponse } from 'axios';
import queryString from 'query-string';

export class BaseApi {
	url: string;

	constructor(path: string) {
		this.url = import.meta.env.VITE_API_URL + path;
	}

	protected async get<Response, Params = never>(
		path: string,
		params?: Params,
		headers?: Record<string, string>,
	): Promise<AxiosResponse<Response>> {
		return axios.get<Response>(`${this.url}${path}`, {
			params,
			headers: headers ?? { Authorization: localStorage.getItem('token') },
			paramsSerializer: {
				serialize: params => queryString.stringify(params, { arrayFormat: 'none' }),
			},
		});
	}

	protected async post<Response, Body = never>(
		path: string,
		body?: Body,
		headers?: Record<string, string>,
	): Promise<AxiosResponse<Response>> {
		return axios.post<Response, AxiosResponse<Response>, Body>(`${this.url}${path}`, body, {
			headers: headers ?? { Authorization: localStorage.getItem('token') },
		});
	}

	protected async delete<Response, Params = never>(
		path: string,
		params?: Params,
		headers?: Record<string, string>,
	): Promise<AxiosResponse<Response>> {
		return axios.delete<Response>(`${this.url}${path}`, {
			params,
			headers: headers ?? { Authorization: localStorage.getItem('token') },
		});
	}

	protected async patch<Response, Body>(
		path: string,
		body: Body,
		headers?: Record<string, string>,
	): Promise<AxiosResponse<Response>> {
		return axios.patch<Response, AxiosResponse<Response>, Body>(`${this.url}${path}`, body, {
			headers: headers ?? { Authorization: localStorage.getItem('token') },
		});
	}
}
