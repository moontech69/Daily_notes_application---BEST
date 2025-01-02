import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "src/components/layout/MainLayout";
import { useAuth } from "src/hooks/auth/useAuth";

export default function HomePage() {
	const navigate = useNavigate();
	const { authState } = useAuth();

	useEffect(() => {
		if (
			authState.token &&
			Object.getOwnPropertyNames(authState.token).length !== 0
		) {
			navigate("/notes");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<MainLayout>
			<main className="flex flex-1 flex-col items-center justify-center text-center px-6">
				<h2 className="text-4xl font-extrabold mb-4">Capture Your Thoughts</h2>
				<p className="text-lg font-medium mb-6 max-w-lg">
					Stay organized, express your ideas, and keep track of your daily
					reflections. Start noting down your thoughts today with simplicity and
					clarity.
				</p>
				<Link
					to="/sign-in"
					className="px-6 py-3 text-lg font-semibold text-indigo-600 bg-white rounded-lg shadow-md hover:bg-gray-200 hover:text-indigo-700 transition"
				>
					Get Started
				</Link>
			</main>
		</MainLayout>
	);
}
