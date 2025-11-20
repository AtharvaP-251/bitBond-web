import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Connections = () => {
    const user = useSelector((store) => store.user);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("connections");
    const [connections, setConnections] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [connectionsRes, requestsRes] = await Promise.all([
                axios.get(`${BASE_URL}/user/requests/connections`, { withCredentials: true }),
                axios.get(`${BASE_URL}/user/requests/received`, { withCredentials: true })
            ]);
            setConnections(connectionsRes.data.data || []);
            setPendingRequests(requestsRes.data["pending requests"] || []);
        } catch (err) {
            console.error("Error fetching connections:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        fetchData();
    }, [user, navigate, fetchData]);

    const handleViewProfile = useCallback((profile) => {
        setSelectedProfile(profile);
        setShowProfileModal(true);
    }, []);

    const closeProfileModal = useCallback(() => {
        setShowProfileModal(false);
        setSelectedProfile(null);
    }, []);

    const handleReviewRequest = useCallback(async (requestId, status) => {
        try {
            await axios.post(
                `${BASE_URL}/review/send/${status}/${requestId}`,
                {},
                { withCredentials: true }
            );
            fetchData();
        } catch (err) {
            console.error("Error reviewing request:", err);
        }
    }, [fetchData]);

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 pt-20 pb-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3">Connections</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Manage your professional developer network
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-800/50 rounded-xl p-1 inline-flex">
                        <button
                            onClick={() => setActiveTab("connections")}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                activeTab === "connections"
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            My Connections
                            {connections.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                    {connections.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("requests")}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 relative ${
                                activeTab === "requests"
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            Pending Requests
                            {pendingRequests.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-red-500 rounded-full text-xs text-white">
                                    {pendingRequests.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div>
                        {activeTab === "connections" && (
                            <div>
                                {connections.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">No connections yet</h3>
                                        <p className="text-gray-400 mb-6">Start swiping to build your developer network!</p>
                                        <button
                                            onClick={() => navigate("/feed")}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                                        >
                                            Discover Developers
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {connections.map((connection) => (
                                            <div
                                                key={connection._id}
                                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                                            >
                                                <div className="flex items-start space-x-4 mb-4">
                                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                                                        {connection.firstName?.[0]?.toUpperCase()}{connection.lastName?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-bold text-white truncate">
                                                            {connection.firstName} {connection.lastName}
                                                        </h3>
                                                        {connection.age && (
                                                            <p className="text-gray-400 text-sm">{connection.age} years old</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {connection.about && (
                                                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                                        {connection.about}
                                                    </p>
                                                )}

                                                {connection.skills && (
                                                    <div className="flex flex-wrap gap-1 mb-4">
                                                        {connection.skills.split(',').slice(0, 3).map((skill, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs rounded-full"
                                                            >
                                                                {skill.trim()}
                                                            </span>
                                                        ))}
                                                        {connection.skills.split(',').length > 3 && (
                                                            <span className="px-2 py-1 text-gray-400 text-xs">
                                                                +{connection.skills.split(',').length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <button 
                                                    onClick={() => handleViewProfile(connection)}
                                                    className="w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "requests" && (
                            <div>
                                {pendingRequests.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">No pending requests</h3>
                                        <p className="text-gray-400">You're all caught up!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingRequests.map((request) => (
                                            <div
                                                key={request._id}
                                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4 flex-1">
                                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                                                            {request.fromUserId?.firstName?.[0]?.toUpperCase()}{request.fromUserId?.lastName?.[0]?.toUpperCase()}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-xl font-bold text-white">
                                                                {request.fromUserId?.firstName} {request.fromUserId?.lastName}
                                                            </h3>
                                                            <p className="text-gray-400 text-sm">wants to connect with you</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex space-x-3">
                                                        <button
                                                            onClick={() => handleReviewRequest(request.fromUserId._id, "accepted")}
                                                            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleReviewRequest(request.fromUserId._id, "rejected")}
                                                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Profile Modal */}
            {showProfileModal && selectedProfile && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeProfileModal}>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="relative">
                            <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
                            <button
                                onClick={closeProfileModal}
                                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            
                            {/* Profile Picture */}
                            <div className="absolute -bottom-16 left-8">
                                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white border-4 border-gray-900">
                                    {selectedProfile.firstName?.[0]?.toUpperCase()}{selectedProfile.lastName?.[0]?.toUpperCase()}
                                </div>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className="pt-20 pb-8 px-8">
                            <div className="space-y-6">
                                {/* Name and Basic Info */}
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">
                                        {selectedProfile.firstName} {selectedProfile.lastName}
                                    </h2>
                                    {selectedProfile.age && (
                                        <p className="text-gray-400 text-lg">
                                            {selectedProfile.age} years old
                                        </p>
                                    )}
                                    {selectedProfile.gender && (
                                        <p className="text-gray-400 capitalize">
                                            {selectedProfile.gender}
                                        </p>
                                    )}
                                </div>

                                {/* About */}
                                {selectedProfile.about && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">About</h3>
                                        <p className="text-gray-200 leading-relaxed">{selectedProfile.about}</p>
                                    </div>
                                )}

                                {/* Skills */}
                                {selectedProfile.skills && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProfile.skills.split(',').map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/50 text-blue-300 text-sm font-medium rounded-full"
                                                >
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Photo URL if available */}
                                {selectedProfile.photoUrl && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Photo</h3>
                                        <img 
                                            src={selectedProfile.photoUrl} 
                                            alt={`${selectedProfile.firstName} ${selectedProfile.lastName}`}
                                            className="w-full h-64 object-cover rounded-xl"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Connections;
