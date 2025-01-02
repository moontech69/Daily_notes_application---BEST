import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { request } from "../axios";

export const useEditNote = (id: number) => {
	const navigate = useNavigate();

	const editNote = (data: FormData) => {
		return request({ url: `/api/notes/${id}/`, method: "put", data });
	};
	const queryClient = useQueryClient();

	return useMutation(editNote, {
		onSuccess: ({ data }) => {
			queryClient.invalidateQueries("get-notes");
		},
	});
};
