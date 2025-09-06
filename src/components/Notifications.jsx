import React from "react";
import ComingSoon from "./ComingSoon";

const Notifications = () => (
    <ComingSoon
        title="Notifications"
        description="Stay updated with real-time notifications about new connections, messages, and opportunities. Never miss an important update in your developer journey."
        icon={
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
                    d="M15 17h5l-3.5-3.5a5.5 
             5.5 0 00-11 0L1 17h5m4 0v1a3 
             3 0 11-6 0v-1m6 0H9"
                />
            </svg>
        }
    />
);

export default Notifications;
