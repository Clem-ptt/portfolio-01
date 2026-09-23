import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import MainLayout from "./components/layout/MainLayout";

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
            </Route>
        </Routes>
    );
}

export default App;