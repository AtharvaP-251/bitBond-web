import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, unread
    const [pagination, setPagination] = useState(null);
    const navigate = useNavigate();

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const unreadOnly = filter === "unread" ? "true" : "false";
            const response = await axios.get(
                `${BASE_URL}/notifications?unreadOnly=${unreadOnly}`,
                { withCredentials: true }
            );
            if (response.data.success) {
                setNotifications(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchNotifications();
    }, [filter, fetchNotifications]);

    const markAsRead = useCallback(async (notificationId) => {
        try {
            await axios.patch(
                `${BASE_URL}/notifications/read`,
                { notificationIds: [notificationId] },
                { withCredentials: true }
            );
            setNotifications(prev =>
                prev.map((n) =>
                    n._id === notificationId ? { ...n, isRead: true } : n
                )
            );
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await axios.patch(
                `${BASE_URL}/notifications/read`,
                { markAllAsRead: true },
                { withCredentials: true }
            );
            setNotifications(prev => prev.map((n) => ({ ...n, isRead: true })));
        } catch (err) {
            console.error("Error marking all as read:", err);
        }
    }, []);

    const deleteNotification = useCallback(async (notificationId) => {
        try {
            await axios.delete(`${BASE_URL}/notifications`, {
                data: { notificationIds: [notificationId] },
                withCredentials: true,
            });
            setNotifications(prev => prev.filter((n) => n._id !== notificationId));
        } catch (err) {
            console.error("Error deleting notification:", err);
        }
    }, []);

    const deleteAllNotifications = useCallback(async () => {
        try {
            await axios.delete(`${BASE_URL}/notifications`, {
                data: { deleteAll: true },
                withCredentials: true,
            });
            setNotifications([]);
        } catch (err) {
            console.error("Error deleting all notifications:", err);
        }
    }, []);

    const handleNotificationClick = useCallback((notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
    }, [markAsRead, navigate]);

    const getNotificationIcon = (type) => {
        switch (type) {
            case "connection_request":
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                );
            case "connection_accepted":
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case "message":
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                );
            case "profile_view":
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                );
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case "connection_request":
                return "bg-blue-500";
            case "connection_accepted":
                return "bg-green-500";
            case "message":
                return "bg-purple-500";
            case "profile_view":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
        }
    };

    const formatTime = useCallback((timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 7) {
            return date.toLocaleDateString();
        } else if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else if (minutes > 0) {
            return `${minutes}m ago`;
        } else {
            return "Just now";
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="bg-gray-800/50 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Notifications</h1>
                                {pagination && (
                                    <p className="text-sm text-gray-400">
                                        {pagination.unread} unread • {pagination.total} total
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                        <div className="flex rounded-lg overflow-hidden border border-gray-600">
                            <button
                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                    filter === "all"
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                                onClick={() => setFilter("all")}
                            >
                                All
                            </button>
                            <button
                                className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-600 ${
                                    filter === "unread"
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                                onClick={() => setFilter("unread")}
                            >
                                Unread
                            </button>
                        </div>
                        {notifications.length > 0 && (
                            <>
                                <button 
                                    className="px-4 py-2 text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
                                    onClick={markAllAsRead}
                                >
                                    Mark all as read
                                </button>
                                <button 
                                    className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                    onClick={deleteAllNotifications}
                                >
                                    Clear all
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-gray-800/50 rounded-lg shadow-lg p-12 text-center border border-gray-700">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">No notifications yet</h3>
                        <p className="text-gray-400">
                            When you get notifications, they'll show up here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`bg-gray-800/50 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-700/50 transition-all border ${
                                    !notification.isRead ? "border-l-4 border-blue-500 border-t border-r border-b border-gray-700" : "border-gray-700"
                                }`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 ${getNotificationColor(notification.type)} rounded-full flex items-center justify-center text-white flex-shrink-0`}>
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <p className={`text-sm mb-1 ${
                                                    !notification.isRead ? "font-semibold text-white" : "text-gray-300"
                                                }`}>
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    {notification.senderId && (
                                                        <span>
                                                            {notification.senderId.firstName} {notification.senderId.lastName}
                                                        </span>
                                                    )}
                                                    <span>•</span>
                                                    <span>{formatTime(notification.createdAt)}</span>
                                                </div>
                                            </div>

                                            {/* Delete button */}
                                            <button
                                                className="w-8 h-8 rounded-full hover:bg-gray-600 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(notification._id);
                                                }}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
