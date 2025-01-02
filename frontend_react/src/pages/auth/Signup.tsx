import React from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSignup } from "../../services/api/auth/signup";
import { toast } from "react-toastify";
import MainLayout from "src/components/layout/MainLayout";
import "react-toastify/dist/ReactToastify.css";

interface SignupFormData {
	username: string;
	email: string;
	password: string;
	password2: string;
}

const initialValues: SignupFormData = {
	username: "",
	email: "",
	password: "",
	password2: "",
};

const SignUp: React.FC = () => {
	const { mutate } = useSignup();

	const validationSchema = Yup.object({
		username: Yup.string()
			.min(3, "Username must be at least 3 characters")
			.required("Username is required"),
		email: Yup.string()
			.email("Invalid email address")
			.required("Email is required"),
		password: Yup.string()
			.min(8, "Password must be at least 8 characters")
			.matches(/[A-Z]/, "Password must contain at least one uppercase letter")
			.matches(/[a-z]/, "Password must contain at least one lowercase letter")
			.matches(/[0-9]/, "Password must contain at least one number")
			.matches(
				/[@$!%*?&#]/,
				"Password must contain at least one special character"
			)
			.required("Password is required"),
		password2: Yup.string()
			.oneOf([Yup.ref("password"), null], "Passwords must match")
			.required("Confirm Password is required"),
	});
	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: (values) => {
			mutate(values, {
				onSuccess: (response: any) => {
					toast.success("Sign up successfully!", {
						position: "top-right",
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "colored",
					});
				},
				onError: ({ response }: any) => {
					toast.error(response.data.message, {
						position: "top-right",
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "colored",
					});
				},
			});
		},
	});

	return (
		<MainLayout>
			<div className="h-screen px-4 bg-white text-slate-900 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center h-full max-w-8xl md:px-10 lg:flex-row justify-evenly">
					<div>
						<div className="w-full max-w-md px-8 py-4 space-y-8 rounded-lg bg-slate-800 md:px-16 md:py-12">
							<div>
								<h2 className="mt-6 text-2xl font-medium text-center text-white">
									Create your account
								</h2>
							</div>
							<form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
								<div className="-space-y-px rounded-md shadow-sm">
									<div>
										<input
											id="username"
											name="username"
											type="text"
											required
											className="relative block w-full h-10 px-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
											placeholder="Username"
											value={formik.values.username}
											onChange={formik.handleChange}
										/>
										{formik.touched.username && formik.errors.username && (
											<p className="text-red-500 text-sm">
												{formik.errors.username}
											</p>
										)}
									</div>
									<br />
									<div>
										<input
											id="email"
											name="email"
											type="email"
											required
											className="relative block w-full h-10 px-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
											placeholder="Email address"
											value={formik.values.email}
											onChange={formik.handleChange}
										/>
										{formik.touched.email && formik.errors.email && (
											<p className="text-red-500 text-sm">
												{formik.errors.email}
											</p>
										)}
									</div>
									<br />
									<div>
										<input
											id="password"
											name="password"
											type="password"
											required
											className="relative block w-full h-10 px-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
											placeholder="Password"
											value={formik.values.password}
											onChange={formik.handleChange}
										/>
										{formik.touched.password && formik.errors.password && (
											<p className="text-red-500 text-sm">
												{formik.errors.password}
											</p>
										)}
									</div>
									<br />
									<div>
										<input
											id="password2"
											name="password2"
											type="password"
											required
											className="relative block w-full h-10 px-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
											placeholder="Confirm Password"
											value={formik.values.password2}
											onChange={formik.handleChange}
										/>
										{formik.touched.password2 && formik.errors.password2 && (
											<p className="text-red-500 text-sm">
												{formik.errors.password2}
											</p>
										)}
									</div>
								</div>

								<div>
									<button
										type="submit"
										className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Sign up
									</button>
								</div>
							</form>

							<div className="mt-6 text-center">
								<span className="text-white">Already have an account? </span>
								<Link
									to="/sign-in"
									className="font-medium text-indigo-600 hover:text-indigo-500"
								>
									Sign in
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default SignUp;
