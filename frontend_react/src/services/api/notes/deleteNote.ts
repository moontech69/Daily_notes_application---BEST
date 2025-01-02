import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

import { request } from "../axios"; 

export const useDeleteNote = () => {
	const deleteNote = (id: number) => {
		return request({ url: `/api/notes/${id}/`, method: "delete" });
	};
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(deleteNote, {
		onSuccess: ({ data }) => {
			queryClient.invalidateQueries("get-notes");
			navigate("/notes");
		},
	});
};
