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
        <main className="page-container admin-dashboard">
            <header className="admin-dashboard-header">
                <div>
                    <p className="section-eyebrow">PORTFOLIO MANAGEMENT</p>
                    <h1>Admin Dashboard</h1>
                    <p className="admin-dashboard-description">
                        Manage your projects and technologies from one place.
                    </p>
                </div>

                <button
                    className="admin-logout-button"
                    type="button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </header>

            <section className="admin-dashboard-section">
                <h2>Management</h2>

                <nav
                    className="admin-dashboard-grid"
                    aria-label="Admin navigation"
                >
                    <Link
                        className="admin-dashboard-card"
                        to="/admin/projects"
                    >
                        <span className="admin-card-label">01 / PROJECTS</span>
                        <h3>Manage Projects</h3>
                        <p>
                            Create, update, feature, and organize your portfolio
                            projects.
                        </p>
                        <span className="admin-card-action">
                            Open projects <span aria-hidden="true">→</span>
                        </span>
                    </Link>

                    <Link
                        className="admin-dashboard-card"
                        to="/admin/technologies"
                    >
                        <span className="admin-card-label">02 / TECHNOLOGIES</span>
                        <h3>Manage Technologies</h3>
                        <p>
                            Maintain the technologies displayed across your
                            portfolio.
                        </p>
                        <span className="admin-card-action">
                            Open technologies <span aria-hidden="true">→</span>
                        </span>
                    </Link>
                </nav>
            </section>
        </main>
    );
};

export default AdminPage;