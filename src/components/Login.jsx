import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                `${BASE_URL}/auth/login`,
                {
                    emailId: email,
                    password: password,
                },
                { withCredentials: true }
            );

            dispatch(addUser(res.data));
            navigate("/");
        } catch (err) {
            console.error("Login failed:", err);
            setError(
                err.response?.data?.message || "Login failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-400 opacity-10 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-r from-indigo-700 to-emerald-500 opacity-10 blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="relative max-w-md w-full bg-white/90 dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 backdrop-blur-sm">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Login to continue to your developer network
                    </p>
                </div>

                {/* Login Form */}
                <form className="space-y-4" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 rounded-md p-3 animate-slide-up">
                            <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                        >
                            Email Address *
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                        >
                            Password *
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                aria-label="Toggle password visibility"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l6.878 6.878M12 12l-3.878-3.878"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Remember me
                            </span>
                        </label>
                        <a
                            href="#"
                            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 transition-colors"
                        >
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading && (
                            <svg
                                className="w-4 h-4 animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                ></path>
                            </svg>
                        )}
                        {isLoading ? "Signing in..." : "Login"}
                    </button>

                    <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                        Don’t have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-medium text-blue-600 hover:underline dark:text-blue-400 transition-colors"
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
