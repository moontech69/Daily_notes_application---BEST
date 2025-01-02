import { useNavigate, useParams } from "react-router-dom";
import { useGetNoteById } from "src/services/api/notes/getNoteById";
import { useEditNote } from "src/services/api/notes/editNote";
import NoteForm from "src/components/note/NoteFrom";
import Sidebar from "src/components/layout/Sidebar";
import { IsLoading } from "src/components/global/IsLoading";
import { toast } from "react-toastify";

const EditNote = () => {
	const { id: idStr } = useParams();
	const id = Number(idStr);
	const navigate = useNavigate();
	const { data: note, isLoading, error } = useGetNoteById(id);
	const { mutate } = useEditNote(id);

	if (error) {
		navigate("/404");
	}

	const handleSubmit = (values: {
		title: string;
		description: string;
		audio: Blob | null;
	}) => {
		const formData = new FormData();
		formData.append("title", values.title);
		formData.append("description", values.description);
		if (values.audio) {
			formData.append("audio", values.audio);
		}

		mutate(formData, {
			onSuccess: () => {
				navigate("/notes");
				toast.success("Saved successfully!", {
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
				navigate("/notes");
				toast.error("Failed to save!", {
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
	};

	return (
		<Sidebar>
			{isLoading ? (
				<IsLoading />
			) : (
				<NoteForm initialValues={note} onSubmit={handleSubmit} />
			)}
		</Sidebar>
	);
};

export default EditNote;
