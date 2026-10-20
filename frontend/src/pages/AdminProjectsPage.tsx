import { useCallback, useEffect, useState } from "react";
import { getProjects, deleteProject } from "../api/projects";
import type { Project } from "../types/project";
import ProjectForm from "../components/projects/ProjectForm";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectImageManager from "../components/projects/ProjectImageManager";
import PageContainer from "../components/layout/PageContainer";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import BackButton from "../components/ui/BackButton";

const AdminProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [imageProject, setImageProject] = useState<Project | null>(null);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

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

    useEffect(() => {
        if (!isFormOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleCloseForm();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isFormOpen]);

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

    const handleProjectUpdated = (updatedProject: Project) => {
        setProjects((currentProjects) =>
            currentProjects.map((project) =>
                project.id === updatedProject.id
                    ? { ...project, imageUrl: updatedProject.imageUrl }
                    : project
            )
        );

        setImageProject((currentProject) =>
            currentProject?.id === updatedProject.id
                ? { ...currentProject, imageUrl: updatedProject.imageUrl }
                : currentProject
        );
    };

    const handleDelete = async () => {
        if (!projectToDelete) {
            return;
        }

        const projectId = projectToDelete.id;

        try {
            setDeletingId(projectId);
            setError("");

            await deleteProject(projectId);

            setProjects((current) =>
                current.filter((project) => project.id !== projectId)
            );

            setProjectToDelete(null);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete project."
            );
            setProjectToDelete(null);
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <div className="admin-state">
                    <p>Loading projects...</p>
                </div>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <div className="admin-state" role="alert">
                    <p>{error}</p>
                    <button type="button" onClick={() => void loadProjects()}>
                        Try Again
                    </button>
                </div>
            </PageContainer>
        );
    }

    return (
        <>
            <div className="page-back-navigation">
                <BackButton label="Back to Dashboard" to="/admin" />
            </div>

            <PageContainer>
                <main className="admin-projects-page">
                    <header className="admin-page-header">
                        <div>
                            <p className="section-eyebrow">
                                PORTFOLIO MANAGEMENT
                            </p>
                            <h1>Projects</h1>
                            <p className="admin-page-description">
                                Create, update, and manage the projects displayed
                                in your portfolio.
                            </p>
                        </div>

                        <button
                            className="admin-primary-button"
                            type="button"
                            onClick={handleCreate}
                        >
                            <span aria-hidden="true">+</span> Create Project
                        </button>
                    </header>

                    <section className="admin-projects-section">
                        <div className="admin-list-heading">
                            <h2>All Projects</h2>
                            <span className="admin-count">
                                {projects.length}{" "}
                                {projects.length === 1 ? "project" : "projects"}
                            </span>
                        </div>

                        {projects.length === 0 ? (
                            <div className="admin-empty-state">
                                <h3>No projects yet</h3>
                                <p>
                                    Create your first project to start building
                                    your portfolio.
                                </p>
                                <button
                                    className="admin-primary-button"
                                    type="button"
                                    onClick={handleCreate}
                                >
                                    Create Your First Project
                                </button>
                            </div>
                        ) : (
                            <ul className="admin-project-list">
                                {projects.map((project) => (
                                    <li key={project.id}>
                                        <ProjectCard
                                            project={project}
                                            showAdminActions
                                            onEdit={() => handleEdit(project)}
                                            onDelete={() =>
                                                setProjectToDelete(project)
                                            }
                                            onManageImages={() =>
                                                handleManageImages(project)
                                            }
                                        />

                                        {deletingId === project.id && (
                                            <p className="admin-inline-status">
                                                Deleting project...
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {isFormOpen && (
                        <div
                            className="admin-dialog-backdrop"
                            role="presentation"
                        >
                            <section
                                className="admin-dialog project-form-dialog"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="project-form-title"
                            >
                                <header className="admin-dialog-header">
                                    <div>
                                        <h2 id="project-form-title">
                                            {editingProject
                                                ? "Edit Project"
                                                : "Create Project"}
                                        </h2>
                                    </div>
                                </header>

                                <ProjectForm
                                    project={editingProject ?? undefined}
                                    onSaved={async () => {
                                        handleCloseForm();
                                        await loadProjects();
                                    }}
                                    onCancel={handleCloseForm}
                                />
                            </section>
                        </div>
                    )}

                    {imageProject && (
                        <ProjectImageManager
                            project={imageProject}
                            onClose={handleCloseImageManager}
                            onProjectUpdated={handleProjectUpdated}
                        />
                    )}

                    {projectToDelete && (
                        <ConfirmDialog
                            title="Delete Project?"
                            message={`Are you sure you want to delete "${projectToDelete.title}"? This action cannot be undone.`}
                            isLoading={deletingId !== null}
                            onConfirm={() => void handleDelete()}
                            onCancel={() => setProjectToDelete(null)}
                        />
                    )}
                </main>
            </PageContainer>
        </>
    );
};

export default AdminProjectsPage;