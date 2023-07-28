import axios, { AxiosInstance } from 'axios';

function createApiInstance(): AxiosInstance {
	const api = axios.create({
		baseURL: 'https://cool-cranachan-9977ef.netlify.app',
	});

	api.defaults.headers.common['Authorization'] = `Bearer ...`;

	return api;
}

export const someApi = createApiInstance();
