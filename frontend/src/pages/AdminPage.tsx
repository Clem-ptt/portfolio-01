import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

const AdminPage = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/admin/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <main>
            <h1>Admin Dashboard</h1>

            <nav aria-label="Admin navigation">
                <ul>
                    <li>
                        <Link to="/admin/projects">
                            Manage Projects
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/technologies">
                            Manage Technologies
                        </Link>
                    </li>
                </ul>
            </nav>

            <button
                type="button"
                onClick={handleLogout}
            >
                Logout
            </button>
        </main>
    );
};

export default AdminPage;