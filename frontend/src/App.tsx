import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
import AdminProjectsPage from "./pages/AdminProjectsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminTechnologiesPage from "./pages/AdminTechnologiesPage";

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />

                <Route
                    path="/projects"
                    element={<ProjectsPage />}
                />

                <Route
                    path="/projects/:slug"
                    element={<ProjectDetailPage />}
                />

                <Route 
                    path="/admin/login" 
                    element={<AdminLoginPage />} 
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/projects"
                    element={
                        <ProtectedRoute>
                            <AdminProjectsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/technologies"
                    element={
                        <ProtectedRoute>
                            <AdminTechnologiesPage />
                        </ProtectedRoute>
                    }
                />

            </Route>
        </Routes>
    );
}

export default App;