import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Feed = () => {
    const user = useSelector((store) => store.user);
    const [feed, setFeed] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const navigate = useNavigate();

    const getFeed = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/user/feed`, {
                withCredentials: true,
            });
            setFeed(res.data.data || []);
        } catch (err) {
            console.error("Error fetching feed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (status, userId) => {
        setIsActionLoading(true);
        try {
            await axios.post(
                `${BASE_URL}/request/send/${status}/${userId}`,
                {},
                { withCredentials: true }
            );

            // Move to next profile
            setCurrentIndex(prev => prev + 1);
        } catch (err) {
            console.error("Error sending request:", err);
        } finally {
            setIsActionLoading(false);
        }
    };

    useEffect(() => {
        getFeed();
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-slate-800 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-10 blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-10 blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-5 blur-3xl"></div>
                </div>

                {/* Hero Section */}
                <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl  text-center ">
                        {/* Main Headlines */}
                        <div className="space-y-8 mb-12 animate-fade-in">
                            <h1 className="text-6xl font-bold text-white leading-tight">
                                {/* Welcome to{' '} */}
                                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-300 bg-clip-text text-transparent animate-shimmer">
                                    bitBond
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 leading-relaxed font-light">
                                Connect Collaborate Grow
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-slide-up">
                            <button
                                onClick={() => navigate('/signup')}
                                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center space-x-2">
                                    <span>Start Your Journey</span>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-slide-up-delayed">
                            {[
                                {
                                    title: "Global Network",
                                    description: "Connect with talented developers from around the world and build meaningful professional relationships."
                                },
                                {
                                    title: "Skill Growth",
                                    description: "Accelerate your learning through collaboration, mentorship, and exposure to diverse projects."
                                },
                                {
                                    title: "Real-time Chat",
                                    description: "Engage in meaningful conversations, share ideas, and collaborate seamlessly with your network."
                                }
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-105"
                                >
                                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
                <div className="text-center max-w-md mx-auto">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 dark:border-gray-700 mx-auto mb-8"></div>
                        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Loading amazing developers...</p>
                </div>
            </div>
        );
    }

    if (!feed || feed.length === 0 || currentIndex >= feed.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-5 blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-5 blur-3xl"></div>
                </div>

                <div className="relative max-w-lg mx-auto px-4 sm:px-6">
                    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                                No More Profiles!
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
                                You've seen all available developers. Check back later for new profiles or explore your connections.
                            </p>
                        </div>

                        <button
                            onClick={getFeed}
                            className="btn-modern mt-8"
                        >
                            Refresh Feed
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentProfile = feed[currentIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20 pb-8">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-5 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-5 blur-3xl"></div>
            </div>

            <div className="relative max-w-lg mx-auto px-4 sm:px-6">
                {/* Progress indicator */}
                <div className="flex space-x-2 mb-8">
                    {feed.slice(currentIndex, currentIndex + 5).map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${index === 0
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                                : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                        />
                    ))}
                </div>

                {/* Profile Card */}
                <div className="relative">
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden animate-slide-up">
                        {/* Profile Header */}
                        <div className="relative">
                            {/* Background Gradient */}
                            <div className="h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500"></div>

                            {/* Profile Picture */}
                            <div className="absolute -bottom-16 left-8">
                                <div className="w-32 h-32 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 shadow-2xl">
                                    <div className="w-full h-full rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-gradient">
                                            {currentProfile.firstName?.[0]?.toUpperCase()}{currentProfile.lastName?.[0]?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Age/Experience Badge */}
                            <div className="absolute top-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    {currentProfile.age || '25'} years
                                </span>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className="pt-20 pb-8 px-8">
                            {/* Name and Title */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {currentProfile.firstName} {currentProfile.lastName}
                                </h2>
                                <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold">
                                    {currentProfile.title || 'Software Developer'}
                                </p>
                            </div>

                            {/* About */}
                            {currentProfile.about && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                                        About
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                                        {currentProfile.about}
                                    </p>
                                </div>
                            )}

                            {/* Skills */}
                            {currentProfile.skills && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">
                                        Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {currentProfile.skills.split(',').map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-2xl border border-blue-200/50 dark:border-blue-700/50 shadow-sm"
                                            >
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contact Info */}
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl p-6 mb-8 border border-gray-200/50 dark:border-gray-600/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                                        {currentProfile.emailId}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleAction('ignored', currentProfile._id)}
                                    disabled={isActionLoading}
                                    className="flex-1 flex items-center justify-center space-x-3 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Pass</span>
                                </button>

                                <button
                                    onClick={() => handleAction('interested', currentProfile._id)}
                                    disabled={isActionLoading}
                                    className="flex-1 btn-modern disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isActionLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-white mx-auto" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            <span>Connect</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Next card preview */}
                    {currentIndex + 1 < feed.length && (
                        <div className="absolute inset-0 -z-10 transform translate-y-3 scale-95 opacity-40">
                            <div className="bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 h-full">
                                <div className="h-40 bg-gradient-to-br from-teal-500 via-blue-500 to-purple-500 rounded-t-3xl"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex justify-between items-center text-center">
                        <div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {currentIndex + 1}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                                Current
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {feed.length}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                                Total
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                                {feed.length - currentIndex - 1}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                                Remaining
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feed;
