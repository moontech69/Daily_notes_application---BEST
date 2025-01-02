import { Link } from "react-router-dom"

export const Header = () => (
  <header className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow-lg">
    <Link to="/" className="text-2xl font-bold">Daily Notes</Link>
    <Link
      to="/sign-in"
      className="px-4 py-2 text-sm font-medium bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
    >
      Sign In
    </Link>
  </header>
)