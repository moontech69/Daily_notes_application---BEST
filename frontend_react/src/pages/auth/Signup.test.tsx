import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { toast } from "react-toastify";
import SignUp from "./Signup";

const mockMutate = jest.fn();
jest.mock("../../services/api/auth/signup", () => ({
  useSignup: () => ({
    mutate: mockMutate
  })
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

const queryClient = new QueryClient();
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe("SignUp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders signup form", () => {
    //@ts-ignore
    render(<SignUp />, { wrapper: Wrapper });
    
    expect(screen.getByText("Create your account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });

  test("shows validation errors for invalid inputs", async () => {
    //@ts-ignore
    render(<SignUp />, { wrapper: Wrapper });
    
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText("Username is required")).toBeInTheDocument();
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
    expect(await screen.findByText("Confirm Password is required")).toBeInTheDocument();
  });

  test("shows password length validation error", async () => {
    //@ts-ignore
    render(<SignUp />, { wrapper: Wrapper });
    
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "weak" } });
    fireEvent.blur(passwordInput);
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText("Password must be at least 8 characters")).toBeInTheDocument();
  });

  test("shows password uppercase validation error", async () => {
    //@ts-ignore
    render(<SignUp />, { wrapper: Wrapper });
    
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "weakpassword" } });
    fireEvent.blur(passwordInput);
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText("Password must contain at least one uppercase letter")).toBeInTheDocument();
  });

  test("shows password number validation error", async () => {
    //@ts-ignore
    render(<SignUp />, { wrapper: Wrapper });
    
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "Weakpassword!" } });
    fireEvent.blur(passwordInput);
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText("Password must contain at least one number")).toBeInTheDocument();
  });

  test("shows password special character validation error", async () => {
    //@ts-ignore
    render(<SignUp />, { wrapper: Wrapper });
    
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "Weakpassword1" } });
    fireEvent.blur(passwordInput);
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText("Password must contain at least one special character")).toBeInTheDocument();
  });

  test("shows error when passwords don't match", async () => {
    //@ts-ignore
    render(<SignUp />, { wrapper: Wrapper });
    
    fireEvent.change(screen.getByPlaceholderText("Password"), { 
      target: { value: "ValidPass1!" } 
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { 
      target: { value: "DifferentPass1!" } 
    });
    fireEvent.blur(screen.getByPlaceholderText("Confirm Password"));
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText("Passwords must match")).toBeInTheDocument();
  });

  test("handles successful signup", async () => {
    //@ts-ignore
    render(<SignUp />, { wrapper: Wrapper });
    
    const inputs = {
      username: screen.getByPlaceholderText("Username"),
      email: screen.getByPlaceholderText("Email address"),
      password: screen.getByPlaceholderText("Password"),
      password2: screen.getByPlaceholderText("Confirm Password")
    };

    for (const [key, input] of Object.entries(inputs)) {
      fireEvent.change(input, { target: { value: key === 'username' ? "TestUser" : 
        key === 'email' ? "test@example.com" : "ValidPass1!" } });
      fireEvent.blur(input);
    }

    await waitFor(() => {
      fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  test("handles signup error", async () => {
    //@ts-ignore
    render(<SignUp />, { wrapper: Wrapper });
    
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "TestUser" }
    });
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "test@example.com" }
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "ValidPass1!" }
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "ValidPass1!" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
      const errorCallback = mockMutate.mock.calls[0][1].onError;
      errorCallback({ response: { data: { message: "Email already exists" } } });
    });

    expect(toast.error).toHaveBeenCalledWith("Email already exists", expect.any(Object));
  });
}); 