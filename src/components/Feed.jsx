import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Feed = () => {
    const user = useSelector((store) => store.user);
    const [feed, setFeed] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const cardRef = useRef(null);
    const navigate = useNavigate();

    const getFeed = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/feed`, {
                withCredentials: true,
            });
            setFeed(res.data.data || []);
            setCurrentIndex(0);
        } catch (err) {
            console.error("Error fetching feed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }
        getFeed();
    }, [user]);

    const handleSwipe = async (direction) => {
        const currentProfile = feed[currentIndex];
        
        try {
            if (direction === "right") {
                // Send connection request
                await axios.post(
                    `${BASE_URL}/request/send/interested/${currentProfile._id}`,
                    {},
                    { withCredentials: true }
                );
            } else {
                // Send ignore request
                await axios.post(
                    `${BASE_URL}/request/send/ignored/${currentProfile._id}`,
                    {},
                    { withCredentials: true }
                );
            }
        } catch (err) {
            console.error("Error sending request:", err);
        }

        // Move to next profile
        setCurrentIndex((prev) => prev + 1);
        setDragOffset({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !dragStart) return;
        
        const offsetX = e.clientX - dragStart.x;
        const offsetY = e.clientY - dragStart.y;
        setDragOffset({ x: offsetX, y: offsetY });
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        
        setIsDragging(false);
        
        // Swipe threshold
        if (Math.abs(dragOffset.x) > 100) {
            if (dragOffset.x > 0) {
                handleSwipe("right");
            } else {
                handleSwipe("left");
            }
        } else {
            setDragOffset({ x: 0, y: 0 });
        }
        
        setDragStart(null);
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setDragStart({ 
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY 
        });
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !dragStart) return;
        
        const offsetX = e.touches[0].clientX - dragStart.x;
        const offsetY = e.touches[0].clientY - dragStart.y;
        setDragOffset({ x: offsetX, y: offsetY });
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        
        setIsDragging(false);
        
        if (Math.abs(dragOffset.x) > 100) {
            if (dragOffset.x > 0) {
                handleSwipe("right");
            } else {
                handleSwipe("left");
            }
        } else {
            setDragOffset({ x: 0, y: 0 });
        }
        
        setDragStart(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading profiles...</p>
                </div>
            </div>
        );
    }

    if (!feed.length || currentIndex >= feed.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex flex-col items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">No more profiles!</h2>
                    <p className="text-gray-400 mb-8">You've seen all available developers. Check back later for more connections!</p>
                    <button
                        onClick={getFeed}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                    >
                        Refresh Feed
                    </button>
                </div>
            </div>
        );
    }

    const currentProfile = feed[currentIndex];
    const rotation = dragOffset.x / 20;
    const opacity = 1 - Math.abs(dragOffset.x) / 300;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 pt-8 pb-8 px-4">
            <div className="max-w-sm mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Discover Developers</h1>
                    <p className="text-gray-400">
                        {currentIndex + 1} / {feed.length}
                    </p>
                </div>

                {/* Card Stack */}
                <div className="relative h-[360px]">
                    {/* Next card preview */}
                    {currentIndex + 1 < feed.length && (
                        <div className="absolute inset-0 transform scale-95 opacity-50">
                            <div className="w-full h-full bg-gray-800 rounded-3xl shadow-2xl"></div>
                        </div>
                    )}

                    {/* Current card */}
                    <div
                        ref={cardRef}
                        className="absolute inset-0 cursor-grab active:cursor-grabbing"
                        style={{
                            transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
                            transition: isDragging ? "none" : "transform 0.3s ease",
                            opacity: opacity,
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
                            {/* Profile Header */}
                            <div className="relative h-36 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                                <div className="absolute inset-0 bg-black/20"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                                            {currentProfile.firstName?.[0]?.toUpperCase()}{currentProfile.lastName?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">
                                                {currentProfile.firstName} {currentProfile.lastName}
                                            </h2>
                                            {currentProfile.age && (
                                                <p className="text-white/80 text-xs">{currentProfile.age} years old</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Content */}
                            <div className="p-4 space-y-3 h-[224px]">
                                {currentProfile.about && (
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">About</h3>
                                        <p className="text-gray-200 leading-relaxed text-sm line-clamp-2">{currentProfile.about}</p>
                                    </div>
                                )}

                                {currentProfile.skills && (
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Skills</h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {currentProfile.skills.split(',').slice(0, 6).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2.5 py-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/50 text-blue-300 text-xs font-medium rounded-full">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {currentProfile.gender && (
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Gender</h3>
                                        <p className="text-gray-200 capitalize text-sm">{currentProfile.gender}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Swipe indicators */}
                        {dragOffset.x > 50 && (
                            <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-base transform rotate-12 shadow-xl">
                                INTERESTED
                            </div>
                        )}
                        {dragOffset.x < -50 && (
                            <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-base transform -rotate-12 shadow-xl">
                                PASS
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center items-center space-x-4 mt-6">
                    <button
                        onClick={() => handleSwipe("left")}
                        className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-200"
                        title="Pass"
                    >
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <button
                        onClick={() => handleSwipe("right")}
                        className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-200"
                        title="Interested"
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>

                {/* Instructions */}
                <div className="text-center mt-6">
                    <p className="text-gray-500 text-sm">
                        Swipe right to connect • Swipe left to pass
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Feed;
