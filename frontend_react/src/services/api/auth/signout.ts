import { useMutation, useQueryClient } from "react-query";
import { request } from "../axios";
import {
	getRefreshToken,
	removeToken,
} from "src/services/storage/cookieService";

export const useSignout = () => {
	const queryClient = useQueryClient();

	const handleSignout = () => {
		const refreshToken = getRefreshToken();

		return request({
			url: "/api/users/logout/",
			method: "post",
			data: { refresh_token: refreshToken },
		});
	};

	return useMutation(handleSignout, {
		onSettled: () => {
			removeToken();
			queryClient.invalidateQueries();
			window.location.href = "/";
		},
	});
};
