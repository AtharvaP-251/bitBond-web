import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const HomePage = () => {
    const navigate = useNavigate();
    const user = useSelector((store) => store.user);

    // If user is logged in, redirect to feed
    if (user) {
        navigate('/');
        return null;
    }

    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: "Connect with Developers",
            description: "Build meaningful professional relationships with developers from around the world"
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 002 2h2a2 2 0 002-2V4a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
                </svg>
            ),
            title: "Showcase Your Skills",
            description: "Create detailed profiles highlighting your technical expertise and project portfolio"
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ),
            title: "Real-time Collaboration",
            description: "Chat with fellow developers, share ideas, and collaborate on exciting projects"
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: "Career Growth",
            description: "Discover opportunities, get mentorship, and accelerate your development career"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-10 blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-10 blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 animate-fade-in">
                            Connect with
                            <span className="block text-gradient">Amazing Developers</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
                            Join the largest community of developers. Build connections, share knowledge,
                            and grow your career with like-minded professionals.
                        </p>

                        {/* <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-up">
                            <button
                                onClick={() => navigate('/signup')}
                                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                            >
                                <span className="relative z-10">Start Connecting</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-xl transition-all duration-300 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900"
                            >
                                Sign In
                            </button>
                        </div> */}

                        {/* Hero Image/Illustration */}
                        <div className="relative animate-slide-up">
                            <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Mock Profile Cards */}
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 card-hover">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                                    <span className="text-white font-bold">
                                                        {item === 1 ? 'JS' : item === 2 ? 'PY' : 'RU'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {item === 1 ? 'Alex Chen' : item === 2 ? 'Sarah Kim' : 'Mike Johnson'}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        {item === 1 ? 'Full Stack Dev' : item === 2 ? 'Data Scientist' : 'Backend Engineer'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {item === 1 && ['React', 'Node.js'].map((skill) => (
                                                    <span key={skill} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {item === 2 && ['Python', 'ML'].map((skill) => (
                                                    <span key={skill} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {item === 3 && ['Rust', 'Go'].map((skill) => (
                                                    <span key={skill} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-xs rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </section >

            {/* Features Section */}
            < section className="py-20" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Why Choose <span className="text-gradient">bitBond</span>?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Everything you need to build and grow your developer network in one platform
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="group relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-professional hover:shadow-professional-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 card-hover">
                                <div className="text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* CTA Section */}
            < section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600" >
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of developers who are already building amazing connections and advancing their careers.
                    </p>
                    {/* <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                        >
                            Create Free Account
                        </button> */}
                    {/* <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold rounded-xl transition-all duration-300"
                        >
                            Sign In
                        </button> */}
                    {/* </div> */}
                </div>
            </section >
        </div >
    );
};

export default HomePage; 