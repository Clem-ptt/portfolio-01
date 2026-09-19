import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProjectBySlug } from "../api/projects";
import type { Project } from "../types/project";

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
                console.error(error);
                setError("Failed to load project.");
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [slug]);

    if (loading) {
        return <h1>Loading project...</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
    }

    if (!project) {
        return <h1>Project not found.</h1>;
    }

    return (
        <main>
            <Link to="/projects">
                ← Back to Projects
            </Link>

            <h1>{project.title}</h1>

            <p>{project.description}</p>

            {project.imageUrl && (
                <img
                    src={project.imageUrl}
                    alt={project.title}
                />
            )}

            {project.featured && (
                <span>Featured</span>
            )}

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
        </main>
    );
}

export default ProjectDetailPage;