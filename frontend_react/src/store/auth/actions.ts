import { Token } from "src/types/auth/tokens";
import { AuthActionTypes } from "./types";

interface AddTokenAction {
	type: AuthActionTypes.ADD_TOKEN;
	payload: Token;
}

interface RemoveTokenAction {
	type: AuthActionTypes.REMOVE_TOKEN;
}

interface UpdateTokenAction {
	type: AuthActionTypes.UPDATE_TOKEN;
	payload: Token;
}

export type AuthActions =
	| AddTokenAction
	| RemoveTokenAction
	| UpdateTokenAction;