import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { toast } from "react-toastify";
import NotesList from "./NotesList";

//@ts-ignore
global.IntersectionObserver = class IntersectionObserver {
	constructor() {
		//@ts-ignore
		this.root = null;
		//@ts-ignore
		this.rootMargin = "0px";
		//@ts-ignore
		this.thresholds = [0];
	}
	observe() {
		return null;
	}
	unobserve() {
		return null;
	}
	disconnect() {
		return null;
	}
	takeRecords() {
		return [];
	}
};

const mockMutate = jest.fn();
const mockRefetch = jest.fn();
jest.mock("src/services/api/notes/deleteNote", () => ({
	useDeleteNote: () => ({
		mutate: mockMutate,
		refetch: mockRefetch,
	}),
}));

const mockNotes = [
	{ id: 1, title: "Note 1", description: "Description 1", audio_url: "url1" },
	{ id: 2, title: "Note 2", description: "Description 2", audio_url: "url2" },
];

type Note = {
	id: number;
	title: string;
	description: string;
	audio_url: string;
};

let mockGetNotesResponse: {
	data: Note[] | undefined;
	isLoading: boolean;
	refetch: jest.Mock;
} = {
	data: mockNotes,
	isLoading: false,
	refetch: mockRefetch,
};

jest.mock("src/services/api/notes/getNotes", () => ({
	useGetNotes: () => mockGetNotesResponse,
}));

jest.mock("react-toastify", () => ({
	toast: {
		success: jest.fn(),
		error: jest.fn(),
	},
}));

jest.mock("src/components/note/NoteGrid", () => ({
	__esModule: true,
	default: ({
		notes,
		handleDelete,
	}: {
		notes: any[];
		handleDelete: (id: number) => void;
	}) => (
		<div data-testid="notes-grid">
			{notes.map((note) => (
				<div key={note.id} data-testid={`note-${note.id}`}>
					<button
						onClick={() => handleDelete(note.id)}
						data-testid={`delete-${note.id}`}
					>
						Delete
					</button>
				</div>
			))}
		</div>
	),
}));

jest.mock("src/components/global/Modal", () => ({
	__esModule: true,
	default: ({ isOpen, onConfirm, onCancel, title, description }: any) =>
		isOpen ? (
			<div role="dialog">
				<h2>{title}</h2>
				<p>{description}</p>
				<button data-testid="modal-cancel-button" onClick={onCancel}>
					Cancel
				</button>
				<button data-testid="modal-delete-button" onClick={onConfirm}>
					Delete
				</button>
			</div>
		) : null,
}));

const queryClient = new QueryClient();
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("NotesList", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockGetNotesResponse = {
			data: mockNotes,
			isLoading: false,
			refetch: mockRefetch,
		};
	});

	test("renders notes grid when data is loaded", () => {
		//@ts-ignore
		render(<NotesList />, { wrapper: Wrapper });
		expect(screen.getByTestId("notes-grid")).toBeInTheDocument();
	});

	test("shows loading state", () => {
		mockGetNotesResponse = {
			data: undefined,
			isLoading: true,
			refetch: mockRefetch,
		};
		//@ts-ignore
		render(<NotesList />, { wrapper: Wrapper });
		expect(
			screen.getByText("Fetching your notes... Please wait.")
		).toBeInTheDocument();
	});

	test("opens delete confirmation modal when delete is clicked", () => {
		//@ts-ignore
		render(<NotesList />, { wrapper: Wrapper });

		fireEvent.click(screen.getByTestId("delete-1"));

		expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
		expect(
			screen.getByText(
				"Are you sure you want to delete this note? This action cannot be undone."
			)
		).toBeInTheDocument();
	});

	test("deletes note when confirmation is confirmed", async () => {
		//@ts-ignore
		render(<NotesList />, { wrapper: Wrapper });

		fireEvent.click(screen.getByTestId("delete-1"));

		fireEvent.click(screen.getByTestId("modal-delete-button"));

		expect(mockMutate).toHaveBeenCalledWith(1, expect.any(Object));

		const successCallback = mockMutate.mock.calls[0][1].onSuccess;
		successCallback();

		expect(toast.success).toHaveBeenCalledWith(
			"Deleted successfully!",
			expect.any(Object)
		);
	});

	test("shows error toast when deletion fails", async () => {
		//@ts-ignore
		render(<NotesList />, { wrapper: Wrapper });

		fireEvent.click(screen.getByTestId("delete-1"));
		fireEvent.click(screen.getByTestId("modal-delete-button"));

		const errorCallback = mockMutate.mock.calls[0][1].onError;
		errorCallback();

		expect(toast.error).toHaveBeenCalledWith(
			"Failed to delete!",
			expect.any(Object)
		);
	});

	test("closes modal without deleting when cancelled", () => {
		//@ts-ignore
		render(<NotesList />, { wrapper: Wrapper });

		fireEvent.click(screen.getByTestId("delete-1"));
		fireEvent.click(screen.getByTestId("modal-cancel-button"));

		expect(mockMutate).not.toHaveBeenCalled();
		expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
	});
});
