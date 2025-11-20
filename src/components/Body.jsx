import { Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import NavBar from "./NavBar";

const Body = () => {
    const user = useSelector((store) => store.user);
    const location = useLocation();
    const dispatch = useDispatch();
    const [isAuthChecking, setIsAuthChecking] = useState(true);

    const fetchProfile = useCallback(async () => {
        try {
            const res = await axios.get(`${BASE_URL}/profile`, {
                withCredentials: true,
            });
            dispatch(addUser(res.data.data));
        } catch (err) {
            console.log("Not authenticated", err);
        } finally {
            setIsAuthChecking(false);
        }
    }, [dispatch]);
    
    useEffect(() => {
        // Skip if user already exists in Redux (e.g., from login)
        if (user) {
            setIsAuthChecking(false);
            return;
        }
        fetchProfile();
    }, [user, fetchProfile]);

    // Don't show navbar on login/signup pages
    const hideNavBar = ["/login", "/signup"].includes(location.pathname);

    // Show navbar for authenticated users or public pages that need it
    const showNavBar = !hideNavBar && (user || location.pathname === "/");

    return (
        <div className="min-h-screen flex flex-col">
            {showNavBar && <NavBar />}
            <main className="flex-1">
                <Outlet context={{ isAuthChecking }} />
            </main>
            {/* <Footer /> */}
        </div>
    );
};

export default Body;
