import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProjectBySlug } from "../api/projects";
import type { Project } from "../types/project";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import PageContainer from "../components/layout/PageContainer";

function ProjectDetailPage() {
    const { slug } = useParams<{ slug: string }>();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProject = async () => {
            if (!slug) {
                setError("Project slug is missing.");
                setLoading(false);
                return;
            }

            try {
                const data = await getProjectBySlug(slug);
                setProject(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Failed to load project.");
                }
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [slug]);

    if (loading) {
        return (
            <PageContainer>
                <LoadingState message="Loading project..." />
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <ErrorState message={error} />
            </PageContainer>
        );
    }

    if (!project) {
        return (
            <PageContainer>
                <ErrorState message="Project not found." />
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <Link to="/projects">
                ← Back to Projects
            </Link>

            <article className="project-detail">
                {project.imageUrl && (
                    <img
                        className="project-detail-image"
                        src={project.imageUrl}
                        alt={project.title}
                    />
                )}

                <h1>{project.title}</h1>

                {project.featured && (
                    <span>Featured</span>
                )}

                <p>{project.description}</p>

                <div className="project-detail-links">
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </a>
                    )}

                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Live Demo
                        </a>
                    )}
                </div>
            </article>
        </PageContainer>
    );
}

export default ProjectDetailPage;