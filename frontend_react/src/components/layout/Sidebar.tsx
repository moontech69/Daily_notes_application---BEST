/* This example requires Tailwind CSS v2.0+ */
import { useState } from "react";
import { HomeIcon, PlusIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import Modal from "../global/Modal";
import { useSignout } from "src/services/api/auth/signout";

function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

type Props = {
	children: React.ReactNode;
};

const Sidebar = ({ children }: Props) => {
	const [isSignoutModalOpen, setIsSignoutModalOpen] = useState(false);

	const { mutate, isLoading } = useSignout();

	const user = localStorage.getItem("user") ?? "";

	const handleSignoutConfirm = () => {
		setIsSignoutModalOpen(false);
		if (!isLoading) {
			mutate();
		}
	};

	const navigation = [
		{
			name: "Home",
			href: "/notes",
			icon: HomeIcon,
			current: window.location.pathname === "/notes",
		},
		{
			name: "Create note",
			href: "/notes/create",
			icon: PlusIcon,
			current: window.location.pathname.includes("notes/create"),
		},
	];

	return (
		<>
			<div>
				<Modal
					isOpen={isSignoutModalOpen}
					onClose={() => setIsSignoutModalOpen(false)}
					title="Confirm Signout"
					description="Are you sure you want to Signout?"
					confirmLabel="Signout"
					cancelLabel="Cancel"
					onConfirm={handleSignoutConfirm}
				/>

				{/* Mobile Navigation */}

				<nav className="fixed bottom-0 left-0 right-0 z-20 bg-slate-200 lg:hidden shadow-t ">
					<div className=" sm:px-2">
						<ul className="flex items-center justify-between w-full text-black-500">
							{navigation.map((item, index) => {
								return (
									<Link
										key={index}
										to={item.href}
										className={
											"mx-1 px-2 py-2 flex flex-col items-center text-xs border-t-2 transition-all " +
											(item.current
												? "border-slate-900 text-black"
												: " border-transparent")
										}
									>
										<item.icon
											className={classNames(
												item.current
													? "text-slate-900"
													: "text-gray-400 group-hover:text-gray-300",
												" flex-shrink-0 h-6 w-6"
											)}
											aria-hidden="true"
										/>

										{item.name}
									</Link>
								);
							})}
						</ul>
					</div>
				</nav>
				{/* End Mobile Navigation */}

				{/* Static sidebar for desktop */}
				<div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<div className="flex flex-col flex-1 min-h-0 bg-gray-800">
						<div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
							<div className="flex flex-col flex-shrink-0 px-4 space-y-2 space-y-5">
								<div className="flex items-center space-x-2 bg-gray-700 px-3 py-2 ml-auto rounded-lg">
									<span className="text-sm font-medium text-gray-300">
										Hello!
									</span>
									<span className="text-sm font-bold text-white">{user}</span>
								</div>
								<h1 className="text-xl font-bold text-white">Daily Notes</h1>
							</div>
							<nav className="flex-1 px-2 mt-5 space-y-2">
								{navigation.map((item) => (
									<Link
										key={item.name}
										to={item.href}
										className={classNames(
											item.current
												? "bg-gray-900 text-white"
												: "text-gray-300 hover:bg-gray-700 hover:text-white",
											"group flex items-center px-2 py-2 text-sm font-medium rounded-md"
										)}
									>
										<item.icon
											className={classNames(
												item.current
													? "text-gray-300"
													: "text-gray-400 group-hover:text-gray-300",
												"mr-3 flex-shrink-0 h-6 w-6"
											)}
											aria-hidden="true"
										/>
										{item.name}
									</Link>
								))}
							</nav>
						</div>
						<div className="flex flex-shrink-0 p-2 bg-gray-700">
							<button
								onClick={() => setIsSignoutModalOpen(true)}
								className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-5 h-5 mr-2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15.75 9V5.25a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v13.5a2.25 2.25 0 002.25 2.25h6.75a2.25 2.25 0 002.25-2.25V15M12 9l6-6m-6 6l6 6"
									/>
								</svg>
								Sign out
							</button>
						</div>
					</div>
				</div>
				<div className="flex flex-col flex-1 lg:pl-64">
					<div className="sticky top-0 z-10 flex items-center justify-between w-full py-3 px-3 shadow-lg lg:hidden sm:pl-3 sm:pt-3 bg-slate-200">
						<div className="flex justify-between content-center w-full">
							<h1 className="items-center text-xl font-medium">
								Daily Notes - <i>{user}</i>
							</h1>
							<button
								onClick={() => setIsSignoutModalOpen(true)}
								className="flex items-center ml-auto px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-5 h-5 mr-2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15.75 9V5.25a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v13.5a2.25 2.25 0 002.25 2.25h6.75a2.25 2.25 0 002.25-2.25V15M12 9l6-6m-6 6l6 6"
									/>
								</svg>
								Sign out
							</button>
						</div>
					</div>
					<main className="flex-1 px-2 mb-16 md:px-5 lg:mb-2">{children}</main>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
