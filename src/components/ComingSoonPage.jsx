import React from "react";

const ComingSoon = ({ title, description, icon }) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-5 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-5 blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
                {/* Icon */}
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    {icon}
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        {title}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* CTA */}
                <div className="mt-12">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-700/50">
                        <p className="text-lg text-blue-800 dark:text-blue-200 font-medium">
                            🚀 This feature is coming soon! Stay tuned for updates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ComingSoon;
