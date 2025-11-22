import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Connections = () => {
    const user = useSelector((store) => store.user);
    const { isAuthChecking } = useOutletContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("connections");
    const [connections, setConnections] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [passedProfiles, setPassedProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            console.log("Connections: Fetching data...");
            const [connectionsRes, requestsRes, passedRes] = await Promise.all([
                axios.get(`${BASE_URL}/user/requests/connections`, { withCredentials: true }),
                axios.get(`${BASE_URL}/user/requests/received`, { withCredentials: true }),
                axios.get(`${BASE_URL}/user/requests/passed`, { withCredentials: true })
            ]);
            console.log("Connections data:", connectionsRes.data.data);
            console.log("Pending requests:", requestsRes.data["pending requests"]);
            console.log("Passed profiles:", passedRes.data.data);
            setConnections(connectionsRes.data.data || []);
            setPendingRequests(requestsRes.data["pending requests"] || []);
            setPassedProfiles(passedRes.data.data || []);
        } catch (err) {
            console.error("Error fetching connections:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthChecking) return;
        
        if (!user) {
            navigate("/login");
            return;
        }
        fetchData();
    }, [user, navigate, fetchData, isAuthChecking]);

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

    const handleSendInterest = useCallback(async (profileId) => {
        try {
            await axios.post(
                `${BASE_URL}/request/send/interested/${profileId}`,
                {},
                { withCredentials: true }
            );
            // Refresh data to update the list
            fetchData();
        } catch (err) {
            console.error("Error sending interest:", err);
        }
    }, [fetchData]);

    if (isAuthChecking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 pt-20 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-3">Connections</h1>
                    <p className="text-gray-400 text-base">
                        Manage your professional developer network
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-800/50 rounded-xl p-1.5 inline-flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveTab("connections")}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 text-sm ${
                                activeTab === "connections"
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                            }`}
                        >
                            My Connections
                            {connections.length > 0 && (
                                <span className="ml-2 px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                                    {connections.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("requests")}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 relative text-sm ${
                                activeTab === "requests"
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                            }`}
                        >
                            Pending Requests
                            {pendingRequests.length > 0 && (
                                <span className="ml-2 px-2.5 py-0.5 bg-red-500 rounded-full text-xs text-white font-semibold">
                                    {pendingRequests.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("passed")}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 text-sm ${
                                activeTab === "passed"
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                            }`}
                        >
                            Passed
                            {passedProfiles.length > 0 && (
                                <span className="ml-2 px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                                    {passedProfiles.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading...</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        {activeTab === "connections" && (
                            <div>
                                {connections.length === 0 ? (
                                    <div className="text-center py-32">
                                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
                                            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3">No connections yet</h3>
                                        <p className="text-gray-400 mb-8 max-w-md mx-auto">Start swiping to build your developer network and connect with like-minded professionals!</p>
                                        <button
                                            onClick={() => navigate("/feed")}
                                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                        >
                                            Discover Developers
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {connections.map((connection) => (
                                            <div
                                                key={connection._id}
                                                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col group"
                                            >
                                                <div className="flex items-start space-x-4 mb-4">
                                                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-lg">
                                                        {connection.firstName?.[0]?.toUpperCase()}{connection.lastName?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                                                            {connection.firstName} {connection.lastName}
                                                        </h3>
                                                        {connection.age && (
                                                            <p className="text-gray-400 text-sm">{connection.age} years old</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    {connection.about && (
                                                        <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                                                            {connection.about}
                                                        </p>
                                                    )}

                                                    {connection.skills && connection.skills.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {(Array.isArray(connection.skills) 
                                                                ? connection.skills 
                                                                : connection.skills.split(',')
                                                            ).slice(0, 3).map((skill, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs rounded-lg font-medium"
                                                                >
                                                                    {typeof skill === 'string' ? skill.trim() : skill}
                                                                </span>
                                                            ))}
                                                            {(Array.isArray(connection.skills) ? connection.skills : connection.skills.split(',')).length > 3 && (
                                                                <span className="px-3 py-1 text-gray-400 text-xs font-medium">
                                                                    +{(Array.isArray(connection.skills) ? connection.skills : connection.skills.split(',')).length - 3} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <button 
                                                    onClick={() => handleViewProfile(connection)}
                                                    className="w-full py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg transition-all duration-200 text-sm font-medium mt-auto group-hover:bg-blue-600/20 group-hover:border group-hover:border-blue-500/50"
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
                                    <div className="text-center py-32">
                                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
                                            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3">No pending requests</h3>
                                        <p className="text-gray-400">You're all caught up! Check back later for new connection requests.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingRequests.map((request) => (
                                            <div
                                                key={request._id}
                                                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg"
                                            >
                                                <div className="flex items-center justify-between flex-wrap gap-4">
                                                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0 shadow-lg">
                                                            {request.fromUserId?.firstName?.[0]?.toUpperCase()}{request.fromUserId?.lastName?.[0]?.toUpperCase()}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-xl font-bold text-white truncate">
                                                                {request.fromUserId?.firstName} {request.fromUserId?.lastName}
                                                            </h3>
                                                            <p className="text-gray-400 text-sm">wants to connect with you</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex space-x-3">
                                                        <button
                                                            onClick={() => handleReviewRequest(request.fromUserId._id, "accepted")}
                                                            className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleReviewRequest(request.fromUserId._id, "rejected")}
                                                            className="px-6 py-2.5 bg-gray-700/70 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200"
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

                        {activeTab === "passed" && (
                            <div>
                                {passedProfiles.length === 0 ? (
                                    <div className="text-center py-32">
                                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
                                            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3">No passed profiles</h3>
                                        <p className="text-gray-400 mb-8 max-w-md mx-auto">You haven't passed on anyone yet! Browse profiles to expand your network.</p>
                                        <button
                                            onClick={() => navigate("/feed")}
                                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                        >
                                            Browse Profiles
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {passedProfiles.map((profile) => (
                                            <div
                                                key={profile._id}
                                                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 flex flex-col group"
                                            >
                                                <div className="flex items-start space-x-4 mb-4">
                                                    <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-lg">
                                                        {profile.firstName?.[0]?.toUpperCase()}{profile.lastName?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                                                            {profile.firstName} {profile.lastName}
                                                        </h3>
                                                        {profile.age && (
                                                            <p className="text-gray-400 text-sm">{profile.age} years old</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    {profile.about && (
                                                        <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                                                            {profile.about}
                                                        </p>
                                                    )}

                                                    {profile.skills && profile.skills.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {(Array.isArray(profile.skills) 
                                                                ? profile.skills 
                                                                : profile.skills.split(',')
                                                            ).slice(0, 3).map((skill, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-3 py-1 bg-orange-600/20 border border-orange-500/30 text-orange-300 text-xs rounded-lg font-medium"
                                                                >
                                                                    {typeof skill === 'string' ? skill.trim() : skill}
                                                                </span>
                                                            ))}
                                                            {(Array.isArray(profile.skills) ? profile.skills : profile.skills.split(',')).length > 3 && (
                                                                <span className="px-3 py-1 text-gray-400 text-xs font-medium">
                                                                    +{(Array.isArray(profile.skills) ? profile.skills : profile.skills.split(',')).length - 3} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex space-x-2 mt-auto">
                                                    <button 
                                                        onClick={() => handleViewProfile(profile)}
                                                        className="flex-1 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                                                    >
                                                        View Profile
                                                    </button>
                                                    <button 
                                                        onClick={() => handleSendInterest(profile._id)}
                                                        className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 text-sm font-medium transform hover:scale-105 shadow-md"
                                                    >
                                                        Send Interest
                                                    </button>
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
                                {selectedProfile.skills && selectedProfile.skills.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {(Array.isArray(selectedProfile.skills) 
                                                ? selectedProfile.skills 
                                                : selectedProfile.skills.split(',')
                                            ).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/50 text-blue-300 text-sm font-medium rounded-full"
                                                >
                                                    {typeof skill === 'string' ? skill.trim() : skill}
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
