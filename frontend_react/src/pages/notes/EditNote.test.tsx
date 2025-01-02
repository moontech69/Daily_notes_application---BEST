import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import EditNote from "./EditNote";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => mockNavigate,
	useParams: () => ({ id: "1" }),
}));

const mockMutate = jest.fn();
jest.mock("src/services/api/notes/editNote", () => ({
	useEditNote: () => ({
		mutate: mockMutate,
	}),
}));

const mockNote = {
	id: 1,
	title: "Test Note",
	description: "Test Description",
	audio_url: "test-audio-url",
};

let mockGetNoteByIdResponse = {
	data: mockNote,
	isLoading: false,
	error: null,
};

jest.mock("src/services/api/notes/getNoteById", () => ({
	useGetNoteById: () => mockGetNoteByIdResponse,
}));

jest.mock("src/components/note/NoteFrom", () => ({
	__esModule: true,
	default: ({ onSubmit, initialValues }: any) => (
		<form
			data-testid="note-form"
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit({
					title: "Updated Title",
					description: "Updated Description",
					audio: new Blob(["test audio"], { type: "audio/wav" }),
				});
			}}
		>
			<div data-testid="form-values">{JSON.stringify(initialValues)}</div>
			<button type="submit">Submit</button>
		</form>
	),
}));

jest.mock("src/components/global/IsLoading", () => ({
	IsLoading: () => (
		<div data-testid="loading-spinner">Fetching your notes... Please wait.</div>
	),
}));

jest.mock("src/components/layout/Sidebar", () => ({
	__esModule: true,
	default: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

const queryClient = new QueryClient();
const Wrapper = ({ children }: { children: React.ReactNode }) => (
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>{children}</BrowserRouter>
	</QueryClientProvider>
);

describe("EditNote", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockGetNoteByIdResponse = {
			data: mockNote,
			isLoading: false,
			error: null,
		};
	});

	test("renders note form with initial values when data is loaded", () => {
		//@ts-ignore
		render(<EditNote />, { wrapper: Wrapper });
		expect(screen.getByTestId("note-form")).toBeInTheDocument();
		expect(
			JSON.parse(screen.getByTestId("form-values").textContent || "")
		).toEqual(mockNote);
	});

	test("shows loading state while fetching note", () => {
		mockGetNoteByIdResponse = {
			//@ts-ignore
			data: undefined,
			isLoading: true,
			error: null,
		};
		//@ts-ignore
		render(<EditNote />, { wrapper: Wrapper });
		expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
	});

	test("navigates to 404 on error", () => {
		mockGetNoteByIdResponse = {
			//@ts-ignore
			data: undefined,
			isLoading: false,
			//@ts-ignore
			error: new Error("Note not found"),
		};
		//@ts-ignore
		render(<EditNote />, { wrapper: Wrapper });
		expect(mockNavigate).toHaveBeenCalledWith("/404");
	});

	test("handles form submission successfully", () => {
		//@ts-ignore
		render(<EditNote />, { wrapper: Wrapper });

		const form = screen.getByTestId("note-form");
		fireEvent.submit(form);

		expect(mockMutate).toHaveBeenCalled();

		const formDataArg = mockMutate.mock.calls[0][0];
		expect(formDataArg instanceof FormData).toBeTruthy();
		expect(formDataArg.get("title")).toBe("Updated Title");
		expect(formDataArg.get("description")).toBe("Updated Description");
		expect(formDataArg.get("audio")).toBeInstanceOf(Blob);

		const successCallback = mockMutate.mock.calls[0][1].onSuccess;
		successCallback();

		expect(mockNavigate).toHaveBeenCalledWith("/notes");
	});
});
