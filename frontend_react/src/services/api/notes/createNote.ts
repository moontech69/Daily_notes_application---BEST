import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

import { request } from "../axios";

export const useCreateNote = () => {
	const navigate = useNavigate();

	const createNote = (data: FormData) => {
		return request({ url: "/api/notes/", method: "post", data });
	};

	const queryClient = useQueryClient();

	return useMutation(createNote, {
		onSuccess: ({ data }) => {
			queryClient.invalidateQueries("get-notes");
		},
	});
};
