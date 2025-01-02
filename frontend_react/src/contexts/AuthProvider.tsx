import { createContext, useEffect, useReducer } from "react";
import { jwtDecode } from "jwt-decode";
import { useSignout } from "src/services/api/auth/signout";
import { request } from "src/services/api/axios";
import { authReducer } from "src/store/auth/reducer";
import { AuthActionTypes } from "src/store/auth/types";
import { Token } from "src/types/auth/tokens";
import {
	getAccessToken,
	getRefreshToken,
	setToken,
	removeToken as removeTokenLS,
} from "src/services/storage/cookieService";
import { AuthContextType } from "src/types/auth";

type AuthProviderProps = { children: React.ReactNode };

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const { mutate: signout } = useSignout();
	const [state, dispatch] = useReducer(authReducer, {
		token:
			getAccessToken() && getRefreshToken()
				? {
						access: getAccessToken()!,
						refresh: getRefreshToken()!,
				  }
				: undefined,
	});

	useEffect(() => {
		reloadToken();
	}, []);

	const addToken = (token: Token): void => {
		setToken(token);
		scheduleTokenRefresh(token.access);
		dispatch({
			type: AuthActionTypes.ADD_TOKEN,
			payload: token,
		});
	};

	const removeToken = (): void => {
		dispatch({
			type: AuthActionTypes.REMOVE_TOKEN,
		});
		removeTokenLS();
	};

	const refreshToken = async (): Promise<void> => {
		try {
			if (!state.token?.refresh) {
				throw new Error("No refresh token available");
			}

			const response = await request({
				url: "/api/users/refresh/",
				method: "post",
				data: {
					refresh: state.token.refresh,
				},
			});
			const data = response.data;
			if (data?.access) {
				const updatedToken = {
					access: data.access,
					refresh: data.refresh,
				};

				dispatch({
					type: AuthActionTypes.UPDATE_TOKEN,
					payload: updatedToken,
				});

				setToken(updatedToken);
			}
		} catch (error) {
			console.error("Token refresh failed:", error);
		}
	};

	const reloadToken = () => {
		const accessToken = getAccessToken(),
			refreshToken = getRefreshToken();
		if (accessToken && refreshToken) {
			const token = {
				access: accessToken,
				refresh: refreshToken,
			};

			dispatch({
				type: AuthActionTypes.ADD_TOKEN,
				payload: token,
			});
		}
	};

	const scheduleTokenRefresh = (accessToken: string): void => {
		const { exp } = jwtDecode<{ exp: number }>(accessToken);
		const expiresIn = exp * 1000 - Date.now() - 60000;

		setTimeout(async () => {
			try {
				await refreshToken();
				const updatedToken = getAccessToken();
				if (updatedToken) {
					scheduleTokenRefresh(updatedToken);
				}
			} catch (error) {
				console.error("Token refresh failed", error);
				signout();
			}
		}, expiresIn);
	};

	const value = {
		authState: state,
		addToken,
		removeToken,
		refreshToken,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
