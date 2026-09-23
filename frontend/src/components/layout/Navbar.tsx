import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="site-nav">
            <Link
                className="site-nav-brand"
                to="/"
            >
                Clement Salomon
            </Link>

            <div className="site-nav-links">
                <Link to="/">Home</Link>
                <Link to="/projects">Projects</Link>
            </div>
        </nav>
    );
}

export default Navbar;