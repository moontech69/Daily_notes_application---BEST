import axios from "axios";
import { getAccessToken } from "../storage/cookieService";
import { DJANGO_APP_API_URL } from "src/config/settings";

let hasRetried = false; // this prevents infinite loop in case of 401 error

const axiosInstance = axios.create({
	baseURL: DJANGO_APP_API_URL,
});


axiosInstance.interceptors.request.use(
	(config) => {
		const accessToken = getAccessToken();
		if (accessToken) {
			config.headers = config.headers || {};
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axiosInstance.interceptors.response.use(
	(response) => {
		hasRetried = false;
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		const userContext = window._userContext;
		if (error.response?.status === 401) {
			if (!hasRetried) {
				hasRetried = true;
				if (userContext) {
					await userContext.refreshToken();

					const accessToken = getAccessToken();
					if (accessToken) {
						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
					}
					return axiosInstance(originalRequest);
				}
			} else {
				userContext.removeToken();
				window.location.href = "/sign-in";
			}
		}
		return Promise.reject(error);
	}
);

export const request = ({ ...options }) => {
	return axiosInstance(options);
};
