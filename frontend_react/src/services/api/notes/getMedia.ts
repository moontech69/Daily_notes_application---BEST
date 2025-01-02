import { useMutation, useQuery } from "react-query";
import { request } from "../axios";

export const useGetMedia = () => {
	const fetchMedia = (url: string) => {
		return request({ url, method: "get" });
	};
	return useMutation(fetchMedia, {
		onSuccess: ({ data }) => {
      
		},
	});
};
