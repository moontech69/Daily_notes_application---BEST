import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignIn from "./Signin";
import { QueryClient, QueryClientProvider } from "react-query";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
	toast: {
		success: jest.fn(),
		error: jest.fn(),
		warning: jest.fn(),
	},
}));

const mockMutate = jest.fn();
jest.mock("../../services/api/auth/signin", () => ({
	useSignin: () => ({
		mutate: mockMutate,
	}),
}));

const queryClient = new QueryClient();
const Wrapper: React.FC = ({ children }) => (
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>{children}</BrowserRouter>
	</QueryClientProvider>
);

describe("SignIn", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("renders sign in form with all elements", () => {
		render(<SignIn />, { wrapper: Wrapper });

		expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /sign in/i })
		).toBeInTheDocument();
		expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
	});

	test("handles form submission", async () => {
		render(<SignIn />, { wrapper: Wrapper });

		const submitButton = screen.getByRole("button", { name: /sign in/i });
		const emailInput = screen.getByPlaceholderText(/email address/i);
		const passwordInput = screen.getByPlaceholderText(/password/i);

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "password123" } });
		fireEvent.click(submitButton);

		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(mockMutate).toHaveBeenCalled();
	});

	test("shows warning when forgot password is clicked", () => {
		render(<SignIn />, { wrapper: Wrapper });

		const forgotPasswordButton = screen.getByText(/forgot your password/i);
		fireEvent.click(forgotPasswordButton);

		expect(toast.warning).toHaveBeenCalledWith(
			"Contact with administrator!",
			expect.any(Object)
		);
	});
});
