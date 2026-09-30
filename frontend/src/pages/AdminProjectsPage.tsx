import { useCallback, useEffect, useState } from "react";
import { getProjects, deleteProject } from "../api/projects";
import type { Project } from "../types/project";
import ProjectForm from "../components/projects/ProjectForm";

const AdminProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingProject, setEditingProject] =
        useState<Project | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);
            setError("");

            await deleteProject(id);
            await loadProjects();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete project."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const loadProjects = useCallback(async () => {
        try {
            setError("");
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load projects."
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    if (isLoading) {
        return <p>Loading projects...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <main>
            <h1>Projects</h1>

            <ProjectForm
                project={editingProject ?? undefined}
                onSaved={() => {
                    setEditingProject(null);
                    loadProjects();
                }}
            />
            
            {projects.length === 0 ? (
                <p>No projects found.</p>
            ) : (
                <ul>
                    {projects.map((project) => (
                        <li key={project.id}>
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>

                        <button
                            type="button"
                            onClick={() => setEditingProject(project)}
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDelete(project.id)}
                            disabled={deletingId === project.id}
                        >
                            {deletingId === project.id
                                ? "Deleting..."
                                : "Delete"}
                        </button>
                    </li>
                    ))}
                </ul>
            )}
        </main>
    );
};

export default AdminProjectsPage;