import { Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import NavBar from "./NavBar";

const Body = () => {
    const user = useSelector((store) => store.user);
    const location = useLocation();
    const dispatch = useDispatch();
    const [isAuthChecking, setIsAuthChecking] = useState(true);

    // Fetch user profile on mount if not already loaded
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/profile`, {
                    withCredentials: true,
                });
                dispatch(addUser(res.data.data));
            } catch (err) {
                // User not logged in or token expired
                console.log("Not authenticated");
            } finally {
                setIsAuthChecking(false);
            }
        };
        fetchProfile();
    }, [dispatch]);

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
