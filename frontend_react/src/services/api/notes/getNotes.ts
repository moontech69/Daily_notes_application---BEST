import { useQuery } from "react-query";
import { request } from "../axios";

export const useGetNotes = (searchQuery?: string) => {
	const fetchNotes = () => {
		const url = searchQuery
			? `/api/notes/?search=${encodeURIComponent(searchQuery)}`
			: "/api/notes";
		return request({ url, method: "get" });
	};
	return useQuery("get-notes", fetchNotes, {
		staleTime: 50000,
		refetchOnWindowFocus: true,
		select: (data) => {
			const result = data?.data ? data?.data.map((item: any) => item) : [];
			return result;
		},
	});
};
