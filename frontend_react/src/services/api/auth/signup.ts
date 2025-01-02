import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { request } from "../axios"; 

interface SignupData {
	email: string;
	password: string;
}

export const useSignup = () => {
	const navigate = useNavigate();

	const handleSignup = (data: SignupData) => {
		return request({
			url: "/api/users/register/",
			method: "post",
			data,
		});
	};

	return useMutation(handleSignup, {
		onSuccess: () => {
			navigate("/sign-in");
		},
	});
};
