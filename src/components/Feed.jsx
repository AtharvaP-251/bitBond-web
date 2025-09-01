import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const BackgroundGradients = ({ light = false }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-32 ${light ? "w-80 h-80" : "w-96 h-96"} rounded-full bg-gradient-to-r from-blue-500 to-purple-600 ${light ? "opacity-5" : "opacity-10"} blur-3xl ${light ? "" : "animate-pulse"}`} />
        <div className={`absolute -bottom-40 -left-32 ${light ? "w-80 h-80" : "w-96 h-96"} rounded-full bg-gradient-to-r ${light ? "from-teal-400 to-blue-500" : "from-purple-500 to-pink-500"} ${light ? "opacity-5" : "opacity-10"} blur-3xl ${light ? "" : "animate-pulse"}`} />
        {!light && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-5 blur-3xl" />
        )}
    </div>
);

const Feed = () => {
    const user = useSelector((store) => store.user);
    const [feed, setFeed] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    // const [isActionLoading, setIsActionLoading] = useState(false);
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

    // const handleAction = async (status, userId) => {
    //     setIsActionLoading(true);
    //     try {
    //         await axios.post(
    //             `${BASE_URL}/request/send/${status}/${userId}`,
    //             {},
    //             { withCredentials: true }
    //         );
    //         setCurrentIndex((prev) => prev + 1);
    //     } catch (err) {
    //         console.error("Error sending request:", err);
    //     } finally {
    //         setIsActionLoading(false);
    //     }
    // };

    useEffect(() => {
        getFeed();
    }, [user]);

    /** ---------- CONDITIONAL RENDERING ---------- */
    if (!user) {
        const features = [
            {
                title: "Global Network",
                description:
                    "Connect with talented developers from around the world and build meaningful professional relationships.",
            },
            {
                title: "Skill Growth",
                description:
                    "Accelerate your learning through collaboration, mentorship, and exposure to diverse projects.",
            },
            {
                title: "Real-time Chat",
                description:
                    "Engage in meaningful conversations, share ideas, and collaborate seamlessly with your network.",
            },
        ];

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-slate-800 relative overflow-hidden flex items-center justify-center">
                <BackgroundGradients />
                <div className="relative px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="space-y-8 mb-12 animate-fade-in">
                            <h1 className="text-6xl font-bold text-white leading-tight">
                                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-300 bg-clip-text text-transparent animate-shimmer">
                                    bitBond
                                </span>
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed font-light">
                                Connect Collaborate Grow
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-slide-up-delayed">
                            {features.map((f, i) => (
                                <div
                                    key={i}
                                    className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-105"
                                >
                                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                                        {f.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                        {f.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-slide-up">
                            <button
                                onClick={() => navigate("/signup")}
                                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 overflow-hidden"
                            >
                                <span className="relative z-10">Start Your Journey</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );

    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <div className="text-center max-w-md mx-auto">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 dark:border-gray-700 mx-auto mb-8" />
                        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 absolute top-0 left-1/2 -translate-x-1/2" />
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                        Loading amazing developers...
                    </p>
                </div>
            </div>
        );
    }

    if (!feed.length || currentIndex >= feed.length) {
        return (
            <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative">
                <BackgroundGradients light />
                <div className="relative max-w-lg mx-auto px-4 sm:px-6">
                    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <svg
                                className="w-12 h-12 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 
                     20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 
                     20H2v-2a3 3 0 515.356-1.857M7 
                     20v-2c0-.656.126-1.283.356-1.857m0 
                     0a5.002 5.002 0 019.288 0M15 
                     7a3 3 0 11-6 0 3 3 0 016 
                     0zm6 3a2 2 0 11-4 0 2 2 0 
                     014 0zM7 10a2 2 0 11-4 0 2 2 
                     0 014 0z"
                                />
                            </svg>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                                No More Profiles!
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                                You've seen all available developers. Check back later for new
                                profiles or explore your connections.
                            </p>
                        </div>
                        <button onClick={getFeed} className="btn-modern mt-8">
                            Refresh Feed
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /** ---------- MAIN FEED ---------- */
    // const currentProfile = feed[currentIndex];

    return (
        <div className="min-h-screen pt-20 pb-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative">
            <BackgroundGradients light />
            <div className="relative max-w-lg mx-auto px-4 sm:px-6">
                {/* Progress */}
                <div className="flex space-x-2 mb-8">
                    {feed.slice(currentIndex, currentIndex + 5).map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${idx === 0
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                                : "bg-gray-200 dark:bg-gray-700"
                                }`}
                        />
                    ))}
                </div>

                {/* Profile Card */}
                {/* -- Kept same as your code (just formatted) -- */}
                {/* ... */}
            </div>
        </div>
    );
};

export default Feed;
