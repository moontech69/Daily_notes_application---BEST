import Cookies from "js-cookie";
import { Token } from "src/types/auth/tokens";

const getAccessToken = (): string | undefined => {
	return Cookies.get("access_token");
};

const getRefreshToken = (): string | undefined => {
	return Cookies.get("refresh_token");
};

const setToken = (token: Token): void => {
	Cookies.set("access_token", token.access);
	Cookies.set("refresh_token", token.refresh);
};

const removeToken = (): void => {
	Cookies.remove("access_token");
	Cookies.remove("refresh_token");
};


export { getAccessToken, getRefreshToken, setToken, removeToken };