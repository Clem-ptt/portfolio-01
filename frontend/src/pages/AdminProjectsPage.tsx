import { useCallback, useEffect, useState } from "react";
import { getProjects, deleteProject } from "../api/projects";
import type { Project } from "../types/project";
import ProjectForm from "../components/projects/ProjectForm";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectImageManager from "../components/projects/ProjectImageManager";

const AdminProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingProject, setEditingProject] =
        useState<Project | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [imageProject, setImageProject] =
        useState<Project | null>(null);

    const handleManageImages = (project: Project) => {
        setImageProject(project);
    };
    
    const handleCloseImageManager = () => {
        setImageProject(null);
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
        let cancelled = false;

        const fetchProjects = async () => {
            try {
                const data = await getProjects();

                if (!cancelled) {
                    setProjects(data);
                }
            } catch (error) {
                if (!cancelled) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load projects."
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        void fetchProjects();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleCreate = () => {
        setEditingProject(null);
        setIsFormOpen(true);
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProject(null);
    };

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

    if (isLoading) {
        return <p>Loading projects...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <main>
            <h1>Projects</h1>

            <button
                type="button"
                onClick={handleCreate}
            >
                Create Project
            </button>

            {projects.length === 0 ? (
                <p>No projects found.</p>
            ) : (
                <ul>
                    {projects.map((project) => (
                        <li key={project.id}>
                            <ProjectCard
                                project={project}
                                showAdminActions
                                onEdit={() => handleEdit(project)}
                                onDelete={() => handleDelete(project.id)}
                                onManageImages={() => handleManageImages(project)}
                            />

                            {deletingId === project.id && (
                                <p>Deleting...</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {isFormOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="project-form-title"
                >
                    <div>
                        <h2 id="project-form-title">
                            {editingProject
                                ? "Edit Project"
                                : "Create Project"}
                        </h2>

                        <ProjectForm
                            project={editingProject ?? undefined}
                            onSaved={async () => {
                                handleCloseForm();
                                await loadProjects();
                            }}
                            onCancel={handleCloseForm}
                        />
                    </div>
                </div>
            )}

            {imageProject && (
                <ProjectImageManager
                    project={imageProject}
                    onClose={handleCloseImageManager}
                />
            )}
        </main>
    );
};

export default AdminProjectsPage;