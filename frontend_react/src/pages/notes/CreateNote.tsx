import { useNavigate } from "react-router-dom";
import { useCreateNote } from "src/services/api/notes/createNote";
import Sidebar from "src/components/layout/Sidebar";
import NoteForm from "src/components/note/NoteFrom";
import { toast } from "react-toastify";

type Props = {};

const CreateNote = (props: Props) => {
	const { mutate } = useCreateNote();
	const navigate = useNavigate();

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
				navigate("/notes")
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
				navigate("/notes")
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
			} 
		});
	};

	return (
		<Sidebar>
			<NoteForm onSubmit={handleSubmit} />
		</Sidebar>
	);
};

export default CreateNote;
