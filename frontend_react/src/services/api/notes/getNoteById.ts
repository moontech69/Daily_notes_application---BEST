import { useQuery } from "react-query";
import { request } from "../axios";

export const useGetNoteById = (id: number) => {
	const fetchNoteById = () => {
		return request({ url: `/api/notes/${id}`, method: "get" });
	};
	return useQuery("get-note-by-id", fetchNoteById, {
		staleTime: 0,
		refetchOnWindowFocus: true,
		select: (data) => {
			return data.data;
		},
	});
};
