import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import CreateNote from "./CreateNote";

jest.mock("src/components/layout/Sidebar", () => ({
	__esModule: true,
	default: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => mockNavigate,
}));

const mockMutate = jest.fn();
jest.mock("src/services/api/notes/createNote", () => ({
	useCreateNote: () => ({
		mutate: mockMutate,
	}),
}));

jest.mock("src/components/note/NoteFrom", () => ({
	__esModule: true,
	default: ({ onSubmit }: { onSubmit: (values: any) => void }) => {
		const handleSubmit = () => {
			onSubmit({
				title: "Test Title",
				description: "Test Description",
				audio: new Blob(["test audio"], { type: "audio/wav" }),
			});
		};

		return (
			<form
				data-testid="note-form"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<button type="submit">Submit</button>
			</form>
		);
	},
}));

const queryClient = new QueryClient();
const Wrapper: React.FC = ({ children }) => (
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>{children}</BrowserRouter>
	</QueryClientProvider>
);

describe("CreateNote", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("renders note form", () => {
		render(<CreateNote />, { wrapper: Wrapper });
		expect(screen.getByTestId("note-form")).toBeInTheDocument();
	});

	test("handles form submission successfully", async () => {
		render(<CreateNote />, { wrapper: Wrapper });

		const form = screen.getByTestId("note-form");
		fireEvent.submit(form);

		expect(mockMutate).toHaveBeenCalled();
		const formDataArg = mockMutate.mock.calls[0][0];
		expect(formDataArg instanceof FormData).toBeTruthy();
		expect(formDataArg.get("title")).toBe("Test Title");
		expect(formDataArg.get("description")).toBe("Test Description");
		expect(formDataArg.get("audio")).toBeInstanceOf(Blob);
	});

	test("navigates to notes page on successful submission", async () => {
		render(<CreateNote />, { wrapper: Wrapper });

		const form = screen.getByTestId("note-form");
		fireEvent.submit(form);

		const successCallback = mockMutate.mock.calls[0][1].onSuccess;
		successCallback();

		expect(mockNavigate).toHaveBeenCalledWith("/notes");
	});

	test("handles mutation error", async () => {
		const consoleErrorSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});
		const mockError = new Error("Mutation failed");

		jest.mock(
			"src/services/api/notes/createNote",
			() => ({
				useCreateNote: () => ({
					mutate: (data: any, options: any) => {
						if (options.onError) {
							options.onError(mockError);
						}
					},
				}),
			}),
			{ virtual: true }
		);

		render(<CreateNote />, { wrapper: Wrapper });

		const form = screen.getByTestId("note-form");
		fireEvent.submit(form);

		expect(mockNavigate).not.toHaveBeenCalled();

		consoleErrorSpy.mockRestore();
	});
});
