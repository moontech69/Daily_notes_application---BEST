import { Token } from "src/types/auth/tokens";

export enum AuthActionTypes {
	ADD_TOKEN = "ADD_TOKEN",
	REMOVE_TOKEN = "REMOVE_TOKEN",
	UPDATE_TOKEN = "UPDATE_TOKEN",
}

export type AuthState = { 
  token: Token | undefined 
};
