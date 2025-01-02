import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

import Notes from "./pages/notes/index";
import CreateNote from "./pages/notes/CreateNote";
import SignIn from "./pages/auth/Signin";
import SignUp from "./pages/auth/Signup";
import { RequireAuth } from "./components/global/RequireAuth";
import { useAuth } from "./hooks/auth/useAuth";
import EditNote from "./pages/notes/EditNote";
import NotFound from "./pages/error/404";
import HomePage from "./pages/Home";
import { useSignout } from "./services/api/auth/signout";
import useAutoSignout from "./hooks/auth/useAutoSignout";

function App() {
	const userContext = useAuth();
	const { mutate: signout } = useSignout();

	const auth = !!(userContext.authState.token?.access ?? false);
	useEffect(() => {
		window._userContext = userContext;
	}, [userContext]);
	
	// here you can control auto signout time, 
	// remember that unit is milisecond
	useAutoSignout(signout, 600000); // 10 min

	return (
		<Routes>
			<Route
				path="/"
				element={auth ? <Navigate to="/notes" /> : <HomePage />}
			/>
			<Route
				path="/sign-up"
				element={auth ? <Navigate to="/notes" /> : <SignUp />}
			/>
			<Route
				path="/sign-in"
				element={auth ? <Navigate to="/notes" /> : <SignIn />}
			/>
			<Route
				path="/notes/*"
				element={
					<RequireAuth>
						<Routes>
							<Route index element={<Notes />} />
							<Route path="create" element={<CreateNote />} />
							<Route path=":id" element={<EditNote />} />
						</Routes>
					</RequireAuth>
				}
			/>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default App;
