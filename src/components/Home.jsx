import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const BackgroundGradients = ({ light = false }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
            className={`absolute -top-40 -right-32 ${light ? "w-80 h-80" : "w-96 h-96"
                } rounded-full bg-gradient-to-r from-blue-500 to-purple-600 ${light ? "opacity-5" : "opacity-10"
                } blur-3xl ${light ? "" : "animate-pulse"}`}
        />
        <div
            className={`absolute -bottom-40 -left-32 ${light ? "w-80 h-80" : "w-96 h-96"
                } rounded-full bg-gradient-to-r ${light ? "from-teal-400 to-blue-500" : "from-purple-500 to-pink-500"
                } ${light ? "opacity-5" : "opacity-10"} blur-3xl ${light ? "" : "animate-pulse"
                }`}
        />
        {!light && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-5 blur-3xl" />
        )}
    </div>
);

const Home = () => {
    const navigate = useNavigate();
    const user = useSelector((store) => store.user);

    useEffect(() => {
        if (user) {
            navigate("/feed");
        }
    }, [user, navigate]);

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
                    <div className="mt-14 mb-8 animate-fade-in">
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
};

export default Home;
