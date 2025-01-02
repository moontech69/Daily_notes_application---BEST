import { AuthActions } from "./actions";
import { AuthActionTypes, AuthState } from "./types";

const authReducer = (state: AuthState, action: AuthActions): AuthState => {
	switch (action.type) {
		case AuthActionTypes.ADD_TOKEN: {
			return { ...state, token: action.payload };
		}
		case AuthActionTypes.REMOVE_TOKEN: {
			return { token: undefined };
		}
		case AuthActionTypes.UPDATE_TOKEN: {
			if (!state.token?.refresh) return state;
			return {
				...state,
				token: {
					access: action.payload.access,
					refresh: state.token.refresh,
				},
			};
		}
		default: {
			throw new Error(`Unhandled action type`);
		}
	}
};

export { authReducer };