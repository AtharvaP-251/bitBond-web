import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { removeUser } from "../utils/userSlice";
import { toggleTheme } from "../utils/themeSlice";
import axios from "axios";
import { BASE_URL, POLLING_INTERVALS } from "../utils/constants";

const NavBar = () => {
    const user = useSelector((store) => store.user);
    const isDarkMode = useSelector((store) => store.theme.isDarkMode);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Apply theme to document properly
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
        }
    }, [isDarkMode]);

    const fetchUnreadCount = useCallback(async () => {
        if (!user) return;
        try {
            const response = await axios.get(
                `${BASE_URL}/notifications/unread-count`,
                { withCredentials: true }
            );
            if (response.data.success) {
                setUnreadCount(response.data.count);
            }
        } catch (err) {
            console.error("Error fetching unread count:", err);
        }
    }, [user]);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, POLLING_INTERVALS.NOTIFICATIONS);

        // Listen for custom event when notifications are marked as read
        const handleNotificationsRead = () => {
            fetchUnreadCount();
        };
        window.addEventListener('notificationsRead', handleNotificationsRead);

        return () => {
            clearInterval(interval);
            window.removeEventListener('notificationsRead', handleNotificationsRead);
        };
    }, [fetchUnreadCount]);

    const handleLogout = useCallback(async () => {
        try {
            await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
            dispatch(removeUser());
            navigate('/login');
        } catch (err) {
            console.error("Logout failed:", err);
        }
    }, [dispatch, navigate]);

    const isActiveRoute = useCallback((path) => {
        return location.pathname === path;
    }, [location.pathname]);

    const NavItem = ({ to, children, onClick }) => (
        <button
            onClick={onClick || (() => navigate(to))}
            className={`relative px-4 py-2.5 rounded-xl font-medium text-sm btn-minimal ${isActiveRoute(to)
                    ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800'
                }`}
            style={{ transition: 'color 200ms ease-out, background-color 200ms ease-out' }}
        >
            {children}
            {isActiveRoute(to) && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full dark:bg-blue-400" style={{ transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
            )}
        </button>
    );

    return (
        user && (
            <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center space-x-2 group btn-minimal"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
                                    <span className="text-white font-bold text-lg tracking-tighter">bB</span>
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 hidden sm:block">
                                    bitBond
                                </span>
                            </button>
                        </div>

                        {/* Center Navigation - Show Login/Signup for unauthenticated users */}
                        {user && (
                            // Desktop Navigation for authenticated users
                            <div className="hidden md:flex items-center space-x-1">
                                <NavItem to="/feed">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <span>Feed</span>
                                    </div>
                                </NavItem>
                                <NavItem to="/search">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span>Search</span>
                                    </div>
                                </NavItem>
                                <NavItem to="/connections">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <span>Connections</span>
                                    </div>
                                </NavItem>
                                <NavItem to="/messages">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <span>Messages</span>
                                    </div>
                                </NavItem>
                                <NavItem to="/notifications">
                                    <div className="flex items-center space-x-2 relative">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        <span>Notifications</span>
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-badge-update">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </NavItem>
                            </div>
                        )}

                        {/* Right side actions */}
                        <div className="flex items-center space-x-3">

                            {user ? (
                                <>
                                    {/* User Menu */}
                                    <div className="relative">
                                        <div className="dropdown dropdown-end">
                                            <div
                                                tabIndex={0}
                                                role="button"
                                                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 btn-minimal"
                                                style={{ transition: 'background-color 200ms ease-out, border-color 200ms ease-out' }}
                                            >
                                                <div className="hidden sm:block text-right">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                                                        {user.firstName} {user.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {user.emailId}
                                                    </p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                                    <span className="text-white font-medium text-sm">
                                                        {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                                                    </span>
                                                </div>
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                            <ul className="dropdown-content menu p-2 shadow-2xl bg-white dark:bg-gray-800 rounded-2xl w-64 mt-3 border border-gray-200 dark:border-gray-700 animate-dropdown">
                                                <li>
                                                    <button
                                                        onClick={() => navigate('/profile')}
                                                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left btn-minimal"
                                                        style={{ transition: 'background-color 200ms ease-out' }}
                                                    >
                                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        <span className="text-gray-700 dark:text-gray-200">View Profile</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={() => navigate('/profile/edit')}
                                                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left btn-minimal"
                                                        style={{ transition: 'background-color 200ms ease-out' }}
                                                    >
                                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        <span className="text-gray-700 dark:text-gray-200">Edit Profile</span>
                                                    </button>
                                                </li>
                                                <div className="divider my-2"></div>
                                                <li>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 w-full text-left btn-minimal"
                                                        style={{ transition: 'background-color 200ms ease-out' }}
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        <span>Logout</span>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Mobile menu button for authenticated users */}
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="md:hidden p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 btn-minimal"
                                        style={{ transition: 'background-color 200ms ease-out' }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Mobile menu button for unauthenticated users */}
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="md:hidden p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 btn-minimal"
                                        style={{ transition: 'background-color 200ms ease-out' }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-dropdown">
                            {user ? (
                                <div className="flex flex-col space-y-2">
                                    <NavItem to="/">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            <span>Feed</span>
                                        </div>
                                    </NavItem>
                                    <NavItem to="/search">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <span>Search</span>
                                        </div>
                                    </NavItem>
                                    <NavItem to="/connections">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <span>Connections</span>
                                        </div>
                                    </NavItem>
                                    <NavItem to="/messages">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <span>Messages</span>
                                        </div>
                                    </NavItem>
                                    <NavItem to="/notifications">
                                        <div className="flex items-center space-x-2 relative">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                            <span>Notifications</span>
                                            {unreadCount > 0 && (
                                                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </NavItem>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-3 px-4">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full px-6 py-3 text-gray-700 dark:text-gray-300 font-medium border border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 dark:hover:border-blue-400 btn-minimal"
                                        style={{ transition: 'color 200ms ease-out, border-color 200ms ease-out, box-shadow 200ms ease-out' }}
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg btn-minimal"
                                        style={{ transition: 'opacity 200ms ease-out, transform 200ms ease-out, box-shadow 200ms ease-out' }}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        )

    );
};

export default NavBar;