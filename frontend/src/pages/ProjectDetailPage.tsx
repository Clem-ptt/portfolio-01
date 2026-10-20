import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getProjectBySlug,
    getProjectImages,
} from "../api/projects";
import type { Project, ProjectImage } from "../types/project";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import PageContainer from "../components/layout/PageContainer";
import ProjectImagePlaceholder from "../components/projects/ProjectImagePlaceholder";
import BackButton from "../components/ui/BackButton";

function ProjectDetailPage() {
    const { slug } = useParams<{ slug: string }>();

    const [project, setProject] = useState<Project | null>(null);
    const [images, setImages] = useState<ProjectImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadProject = async () => {
            if (!slug) {
                setError("Project slug is missing.");
                setLoading(false);
                return;
            }

            try {
                const data = await getProjectBySlug(slug);

                if (cancelled) return;

                setProject(data);

                const projectImages = await getProjectImages(data.id);

                if (cancelled) return;

                setImages(projectImages);
            } catch (error) {
                if (cancelled) return;

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load project."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadProject();

        return () => {
            cancelled = true;
        };
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
        <>
            <div className="page-back-navigation">
                <BackButton
                    label="Back to Projects"
                    to="/projects"
                />
            </div>

            <PageContainer>
                <article className="project-detail">
                    {project.imageUrl ? (
                        <img
                            className="project-detail-image"
                            src={project.imageUrl}
                            alt={project.title}
                        />
                    ) : (
                        <ProjectImagePlaceholder className="project-detail-image" />
                    )}

                    <div className="project-detail-heading">
                        <h1>{project.title}</h1>

                        {project.featured && (
                            <span
                                className="project-featured-star"
                                title="Featured project"
                                aria-label="Featured project"
                            >
                                ★
                            </span>
                        )}
                    </div>

                    <p>{project.description}</p>

                    {project.technologies?.length > 0 && (
                        <section className="project-detail-technologies">
                            <h2>Tech Stack</h2>

                            <div className="project-technologies">
                                {project.technologies.map((technology) => (
                                    <span
                                        key={technology.id}
                                        className="project-technology"
                                        title={technology.name}
                                    >
                                        {technology.iconUrl && (
                                            <img
                                                src={technology.iconUrl}
                                                alt=""
                                                loading="lazy"
                                            />
                                        )}

                                        {technology.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {images.length > 0 && (
                        <div className="project-detail-images">
                            {images.map((image) => (
                                <img
                                    key={image.id}
                                    src={image.url}
                                    alt={`${project.title} image`}
                                    loading="lazy"
                                />
                            ))}
                        </div>
                    )}

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
        </>
    );
}

export default ProjectDetailPage;