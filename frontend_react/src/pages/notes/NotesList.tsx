import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDeleteNote } from "src/services/api/notes/deleteNote";
import { useGetNotes } from "src/services/api/notes/getNotes";
import Modal from "src/components/global/Modal";
import { IsLoading } from "src/components/global/IsLoading";
import NotesGrid from "src/components/note/NoteGrid";
import { Note } from "src/types/note";

interface NotesListProps {
	sortBy: "newest" | "oldest" | "title-asc" | "title-desc";
	searchQuery: string;
}

const NotesList = ({ sortBy, searchQuery }: NotesListProps) => {
	const { data, isLoading, refetch } = useGetNotes(searchQuery);
	const { mutate } = useDeleteNote();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
	const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

	useEffect(() => {
		refetch();
	}, [searchQuery, refetch]);

	useEffect(() => {
		if (!data) {
			setFilteredNotes([]);
			return;
		}

		let sorted = [...data];

		switch (sortBy) {
			case "newest":
				sorted.sort(
					(a, b) =>
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				);
				break;
			case "oldest":
				sorted.sort(
					(a, b) =>
						new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
				);
				break;
			case "title-asc":
				sorted.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "title-desc":
				sorted.sort((a, b) => b.title.localeCompare(a.title));
				break;
		}

		setFilteredNotes(sorted);
	}, [data, sortBy, searchQuery]);

	const handleDelete = (id: number) => {
		setSelectedNoteId(id);
		setIsModalOpen(true);
	};

	const confirmDelete = () => {
		if (selectedNoteId !== null) {
			mutate(selectedNoteId, {
				onSuccess: () => {
					toast.success("Deleted successfully!", {
						position: "top-right",
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "colored",
					});
				},
				onError: () => {
					toast.error("Failed to delete!", {
						position: "top-right",
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "colored",
					});
				},
			});
		}
		setIsModalOpen(false);
	};

	const cancelDelete = () => {
		setSelectedNoteId(null);
		setIsModalOpen(false);
	};

	return (
		<>
			<div className="overflow-x-auto ">
				<div className="py-2 sm:px-6 lg:px-16">
					{isLoading ? (
						<IsLoading />
					) : (
						<div className="mt-5 overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
							<NotesGrid notes={filteredNotes} handleDelete={handleDelete} />
						</div>
					)}
				</div>
			</div>
			<Modal
				isOpen={isModalOpen}
				onClose={cancelDelete}
				title="Confirm Deletion"
				description="Are you sure you want to delete this note? This action cannot be undone."
				confirmLabel="Delete"
				cancelLabel="Cancel"
				onConfirm={confirmDelete}
				onCancel={cancelDelete}
			/>
		</>
	);
};

export default NotesList;
