
import { useCallback, useEffect, useState } from "react";
import { getProjects } from "../api/projects";
import type { Project } from "../types/project";
import ProjectCard from "../components/projects/ProjectCard";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import PageContainer from "../components/layout/PageContainer";

function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProjects = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load projects."
            );
        } finally {
            setLoading(false);
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
                console.error(error);

                if (!cancelled) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load projects."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void fetchProjects();

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <PageContainer className="projects-page">
                <section>
                    <h1>Projects</h1>
                    <LoadingState message="Loading projects..." />
                </section>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer className="projects-page">
                <section>
                    <h1>Projects</h1>
                    <ErrorState
                        message={error}
                        onRetry={loadProjects}
                    />
                </section>
            </PageContainer>
        );
    }

    return (
        <PageContainer className="projects-page">
            <section className="projects-page-header">
                <h1>Projects</h1>
                <p>
                    A collection of applications and projects
                    I've built while developing my skills.
                </p>
            </section>

            <section className="projects-page-list">
                {projects.length === 0 ? (
                    <EmptyState message="No projects available." />
                ) : (
                    <div className="project-grid">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                            />
                        ))}
                    </div>
                )}
            </section>
        </PageContainer>
    );
}

export default ProjectsPage;