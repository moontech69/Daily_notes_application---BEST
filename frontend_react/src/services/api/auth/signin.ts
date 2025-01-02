import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/hooks/auth/useAuth"; 
import { request } from "../axios"; 
import { Token } from "src/types/auth/tokens"; 

export const useSignin = () => {
	const navigate = useNavigate();
	const { addToken } = useAuth();
	const handleSignIn = (data: { email: string; password: string }) => {
		return request({ url: "/api/users/login/", method: "post", data });
	};
	return useMutation(handleSignIn, {
		onSuccess: ({ data }) => {
			const token: Token = {
				access: data.access,
				refresh: data.refresh,
			};
			addToken(token);
			localStorage.setItem("user", data.username);
			navigate("/notes");
		},
	});
};
