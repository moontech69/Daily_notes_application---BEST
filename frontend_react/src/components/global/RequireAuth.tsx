import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "src/hooks/auth/useAuth";

export function RequireAuth({ children }: { children: JSX.Element }) {
	const { authState } = useAuth();
	let location = useLocation();

	if (
		!authState.token ||
		Object.getOwnPropertyNames(authState.token).length === 0
	) {
		return <Navigate to="/" state={{ from: location }} replace />;
	}
	return children;
}
