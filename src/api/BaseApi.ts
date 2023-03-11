import axios, { AxiosResponse } from 'axios';

export class BaseApi {
	url: string;

	constructor(url: string) {
		this.url = url;
	}

	protected async get<Response, Params = never>(path: string, params?: Params): Promise<AxiosResponse<Response>> {
		return axios.get<Response>(`${this.url}${path}`, { params });
	}

	protected async post<Response, Body = never>(path: string, body?: Body): Promise<AxiosResponse<Response>> {
		return axios.post<Response, AxiosResponse<Response>, Body>(`${this.url}${path}`, body);
	}

	protected async delete<Response, Params = never>(path: string, params?: Params): Promise<AxiosResponse<Response>> {
		return axios.delete<Response>(`${this.url}${path}`, { params });
	}

	protected async patch<Response, Body>(path: string, body: Body): Promise<AxiosResponse<Response>> {
		return axios.patch<Response, AxiosResponse<Response>, Body>(`${this.url}${path}`, body);
	}
}
