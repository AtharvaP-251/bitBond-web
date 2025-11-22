import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

export default function Signup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        skills: "",
        about: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await axios.post(
                `${BASE_URL}/auth/signup`,
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    emailId: formData.email, // ✅ backend expects `emailId`
                    password: formData.password,
                    skills: formData.skills,
                    about: formData.about,
                },
                { withCredentials: true }
            );

            console.log("Signup successful, user data:", res.data);
            dispatch(addUser(res.data));
            navigate("/feed");
        } catch (err) {
            console.error("Signup failed:", err);
            setError(
                err.response?.data?.message || "Signup failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
            {/* Glowing background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-10 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-10 blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="relative w-full max-w-md p-6 bg-gray-900 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-white text-center mb-1">
                    Create Your Account
                </h2>
                <p className="text-gray-400 text-center text-sm mb-6">
                    Join <span className="text-blue-500 font-semibold">bitBond</span> and
                    start connecting with developers.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 rounded-md p-3">
                            <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* First + Last Name */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-gray-300 mb-1">First Name *</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                                placeholder="Enter first name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Last Name *</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                                placeholder="Enter last name"
                                required
                            />
                        </div>
                    </div>

                    {/* Email + Password */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-gray-300 mb-1">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Password *</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-2 pr-10 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-200"
                                >
                                    {showPassword ? (
                                        // 👁 Hide password
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
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 
                        0-8.268-2.943-9.543-7a9.97 9.97 0 
                        011.563-3.029m5.858.908a3 3 0 
                        114.243 4.243M9.878 9.878l4.242 
                        4.242M3 3l6.878 6.878M12 12l-3.878-3.878"
                                            />
                                        </svg>
                                    ) : (
                                        // 👁 Show password
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
                                                d="M15 12a3 3 0 11-6 0 3 3 0 
                        016 0zM2.458 12C3.732 7.943 7.523 
                        5 12 5c4.478 0 8.268 2.943 9.542 
                        7-1.274 4.057-5.064 7-9.542 
                        7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-gray-300 mb-1">Skills</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                            placeholder="e.g., React, Node.js"
                        />
                    </div>

                    {/* About */}
                    <div>
                        <label className="block text-gray-300 mb-1">About</label>
                        <textarea
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                            placeholder="Tell us about yourself..."
                        ></textarea>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>

                    {/* Navigate to Login */}
                    <p className="text-center text-gray-400 text-xs mt-2">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-blue-500 hover:underline"
                        >
                            Login
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}
