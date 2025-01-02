import { AuthState } from "src/store/auth/types";
import { Token } from "./tokens";

// Export all auth-related types
export type AuthContextType = {
	authState: AuthState;
	addToken: (token: Token) => void;
	removeToken: () => void;
	refreshToken: () => Promise<void>;
};
