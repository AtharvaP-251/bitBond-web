import React from "react";
import ComingSoon from "./ComingSoon";

const Messages = () => (
    <ComingSoon
        title="Messages"
        description="Start conversations with your connections. Share ideas, collaborate on projects, and build lasting professional relationships through seamless messaging."
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
                    d="M8 12h.01M12 12h.01M16 
             12h.01M21 12c0 4.418-4.03 
             8-9 8a9.863 9.863 0 
             01-4.255-.949L3 20l1.395-3.72C3.512 
             15.042 3 13.574 3 12c0-4.418 
             4.03-8 9-8s9 3.582 9 8z"
                />
            </svg>
        }
    />
);

export default Messages;