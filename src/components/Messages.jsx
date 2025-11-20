import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import { BASE_URL, POLLING_INTERVALS } from "../utils/constants";

const Messages = () => {
    const user = useSelector((store) => store.user);
    const navigate = useNavigate();
    const { isAuthChecking } = useOutletContext();
    const [connections, setConnections] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const lastFetchRef = useRef(0);

    useEffect(() => {
        if (isAuthChecking) return;
        
        if (!user) {
            navigate("/login");
            return;
        }
        fetchConnections();
    }, [user, isAuthChecking, navigate]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Auto-refresh messages when chat is selected
    useEffect(() => {
        if (!selectedChat || isSending) return;

        const interval = setInterval(() => {
            if (Date.now() - lastFetchRef.current > 1000) {
                loadChatMessages(selectedChat, true);
            }
        }, POLLING_INTERVALS.MESSAGES);

        return () => clearInterval(interval);
    }, [selectedChat, isSending]);

    const fetchConnections = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/user/requests/connections`, {
                withCredentials: true,
            });
            setConnections(res.data.data || []);
        } catch (err) {
            console.error("Error fetching connections:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadChatMessages = useCallback(async (connection, silent = false) => {
        if (!silent) {
            setSelectedChat(connection);
        }
        try {
            const res = await axios.get(
                `${BASE_URL}/messages/conversation/${connection._id}`,
                { withCredentials: true }
            );
            const formattedMessages = res.data.data.map((msg) => ({
                id: msg._id,
                senderId: msg.senderId,
                text: msg.text,
                timestamp: new Date(msg.createdAt),
                isOwn: msg.senderId === user._id,
            }));
            setMessages(formattedMessages);
            lastFetchRef.current = Date.now();
        } catch (err) {
            console.error("Error loading messages:", err);
            if (!silent) {
                setMessages([]);
            }
        }
    }, [user?._id]);

    const handleSendMessage = useCallback(async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat || isSending) return;

        setIsSending(true);
        const messageText = newMessage;
        setNewMessage("");

        try {
            const res = await axios.post(
                `${BASE_URL}/messages/send/${selectedChat._id}`,
                { text: messageText },
                { withCredentials: true }
            );

            const message = {
                id: res.data.data._id,
                senderId: user._id,
                text: messageText,
                timestamp: new Date(),
                isOwn: true,
            };

            setMessages((prev) => [...prev, message]);
            lastFetchRef.current = Date.now();
        } catch (err) {
            console.error("Error sending message:", err);
            setNewMessage(messageText);
            alert("Failed to send message. Please try again.");
        } finally {
            setIsSending(false);
        }
    }, [newMessage, selectedChat, isSending, user?._id]);

    const formatTime = useCallback((date) => {
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor(diff / 60000);

        if (hours > 24) {
            return date.toLocaleDateString();
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else if (minutes > 0) {
            return `${minutes}m ago`;
        } else {
            return "Just now";
        }
    }, []);

    if (isAuthChecking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 pt-16 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
            <div className="h-screen flex">
                {/* Sidebar - Connections List */}
                <div className="w-full md:w-96 bg-gray-800/50 border-r border-gray-700 flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-2">Messages</h2>
                        <p className="text-gray-400 text-sm">
                            {connections.length} connection{connections.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Connections List */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : connections.length === 0 ? (
                            <div className="text-center py-20 px-4">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-semibold mb-2">No connections yet</h3>
                                <p className="text-gray-400 text-sm mb-4">Start connecting with developers to chat</p>
                                <button
                                    onClick={() => navigate("/feed")}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all"
                                >
                                    Discover Developers
                                </button>
                            </div>
                        ) : (
                            <div>
                                {connections.map((connection) => (
                                    <button
                                        key={connection._id}
                                        onClick={() => loadChatMessages(connection)}
                                        className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-700/50 transition-colors border-l-4 ${
                                            selectedChat?._id === connection._id
                                                ? "border-blue-500 bg-gray-700/50"
                                                : "border-transparent"
                                        }`}
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                            {connection.firstName?.[0]?.toUpperCase()}{connection.lastName?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <h3 className="text-white font-semibold truncate">
                                                {connection.firstName} {connection.lastName}
                                            </h3>
                                            <p className="text-gray-400 text-sm truncate">Click to start chatting</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 bg-gray-800/50 border-b border-gray-700 flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {selectedChat.firstName?.[0]?.toUpperCase()}{selectedChat.lastName?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">
                                        {selectedChat.firstName} {selectedChat.lastName}
                                    </h3>
                                    <p className="text-gray-400 text-xs">Online</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-xs lg:max-w-md`}>
                                            <div
                                                className={`rounded-2xl px-4 py-2 ${
                                                    message.isOwn
                                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                                        : "bg-gray-700 text-white"
                                                }`}
                                            >
                                                <p className="text-sm">{message.text}</p>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 px-2">
                                                {formatTime(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-4 bg-gray-800/50 border-t border-gray-700">
                                <form onSubmit={handleSendMessage} className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || isSending}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center space-x-2"
                                    >
                                        {isSending ? (
                                            <>
                                                <span>Sending...</span>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            </>
                                        ) : (
                                            <>
                                                <span>Send</span>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Select a conversation</h3>
                                <p className="text-gray-400">Choose a connection from the sidebar to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;