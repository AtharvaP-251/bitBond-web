import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Feed = () => {
    const user = useSelector((store) => store.user);
    const [feed, setFeed] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const getFeed = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/user/feed`, {
                withCredentials: true,
            });
            setFeed(res.data.data || []);
        } catch (err) {
            console.error("Error fetching feed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/"); // if not logged in, go home
            return;
        }
        getFeed();
    }, [user]);

    if (isLoading) {
        return <p className="text-center mt-10">Loading feed...</p>;
    }

    if (!feed.length || currentIndex >= feed.length) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold">No more profiles!</h2>
                <button onClick={getFeed} className="btn-modern mt-4">
                    Refresh Feed
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20">
            {/* your feed UI here */}
            <p className="text-center">Feed content goes here 🚀</p>
        </div>
    );
};

export default Feed;
