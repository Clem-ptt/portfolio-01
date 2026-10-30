import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

type Theme = "light" | "dark";

function MainLayout() {
    const location = useLocation();
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark" ? "dark" : "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === "light" ? "dark" : "light"
        );
    };

    return (
        <>
            <Navbar theme={theme} onToggleTheme={toggleTheme} />

            <main>
                <div key={location.pathname} className="page-transition">
                    <Outlet />
                </div>
            </main>

            <Footer />
        </>
    );
}

export default MainLayout;