import { useNavigate } from "react-router-dom";
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