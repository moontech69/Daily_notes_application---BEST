import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import NotesList from "./NotesList";
import { SearchIcon } from "@heroicons/react/outline";

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";

const Notes = () => {
	const [sortBy, setSortBy] = useState<SortOption>(() => {
		const savedSort = localStorage.getItem("notesSortPreference");
		return (savedSort as SortOption) || "newest";
	});
	const [searchInput, setSearchInput] = useState(() => {
		return localStorage.getItem("searchQuery") || "";
	});

	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		localStorage.setItem("notesSortPreference", sortBy);
	}, [sortBy]);

	useEffect(() => {
		localStorage.setItem("searchQuery", searchQuery);
	}, [searchQuery]);

	const handleSearch = () => {
		setSearchQuery(searchInput);
	};

	return (
		<Sidebar>
			<div className="flex flex-col md:flex-row justify-between items-center my-6 gap-4 px-4">
				<div className="w-full md:w-64 relative flex items-center">
					<input
						type="text"
						placeholder="Search notes..."
						className="w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						onKeyPress={(e) => {
							if (e.key === "Enter") {
								handleSearch();
							}
						}}
					/>
					<button
						onClick={handleSearch}
						className="absolute right-2 p-2 text-gray-500 hover:text-blue-500"
						aria-label="Search"
					>
						<SearchIcon className="h-5 w-5" />
					</button>
				</div>

				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value as SortOption)}
					className="w-full md:w-48 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
				>
					<option value="newest">Newest First</option>
					<option value="oldest">Oldest First</option>
					<option value="title-asc">Title (A-Z)</option>
					<option value="title-desc">Title (Z-A)</option>
				</select>
			</div>

			<NotesList sortBy={sortBy} searchQuery={searchQuery} />
		</Sidebar>
	);
};

export default Notes;
