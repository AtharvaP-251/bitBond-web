import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "./NavBar";

const Body = () => {
    const user = useSelector((store) => store.user);
    const location = useLocation();

    // Don't show navbar on login/signup pages
    const hideNavBar = ["/login", "/signup"].includes(location.pathname);

    // Show navbar for authenticated users or public pages that need it
    const showNavBar = !hideNavBar && (user || location.pathname === "/");

    return (
        <div className="min-h-screen flex flex-col">
            {showNavBar && <NavBar />}
            <main className="flex-1">
                <Outlet />
            </main>
            {/* <Footer /> */}
        </div>
    );
};

export default Body;
