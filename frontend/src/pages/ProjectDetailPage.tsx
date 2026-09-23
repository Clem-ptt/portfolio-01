import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProjectBySlug } from "../api/projects";
import type { Project } from "../types/project";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

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
        return  <LoadingState message="Loading project..." />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    if (!project) {
        return <ErrorState message="Project not found." />;
    }

    return (
        <>
            <Link to="/projects">
                ← Back to Projects
            </Link>

            <article>
                {project.imageUrl && (
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                    />
                )}

                <h1>{project.title}</h1>

                {project.featured && (
                    <span>Featured</span>
                )}

                <p>{project.description}</p>

                <div>
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
        </>
    );
}

export default ProjectDetailPage;