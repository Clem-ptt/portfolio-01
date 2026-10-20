import { NavLink, Link } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";

type NavbarProps = {
    theme: "light" | "dark";
    onToggleTheme: () => void;
};

function Navbar({ theme, onToggleTheme }: NavbarProps) {
    return (
        <nav className="site-nav">
            <Link className="site-nav-brand" to="/">
                Clement Salomon
            </Link>

            <div className="site-nav-links">
                <NavLink to="/" end>
                    Home
                </NavLink>

                <NavLink to="/projects">
                    Projects
                </NavLink>

                <ThemeToggle
                    theme={theme}
                    onToggle={onToggleTheme}
                />
            </div>
        </nav>
    );
}

export default Navbar;