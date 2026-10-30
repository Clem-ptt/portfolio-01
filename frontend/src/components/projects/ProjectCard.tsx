import { Link } from "react-router-dom";
import type { Project } from "../../types/project";
import ProjectImagePlaceholder from "./ProjectImagePlaceholder";

type ProjectCardProps = {
    project: Project;
    showAdminActions?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onManageImages?: () => void;
};

function ProjectCard({
    project,
    showAdminActions = false,
    onEdit,
    onDelete,
    onManageImages,
}: ProjectCardProps) {
    return (
        <article className="project-card">
            {project.imageUrl ? (
                <img
                    className="project-card-image"
                    src={project.imageUrl}
                    alt={project.title}
                />
            ) : (
                <ProjectImagePlaceholder className="project-card-image" />
            )}

            <h2 className="project-card-title">
                <Link to={`/projects/${project.slug}`}>
                    {project.title}
                </Link>

                {project.featured && (
                    <span
                        className="project-featured-star"
                        title="Featured project"
                        aria-label="Featured project"
                    >
                        ★
                    </span>
                )}
            </h2>

            {project.technologies?.length > 0 && (
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
            )}

            <p className="project-card-description">
                {project.description}
            </p>

            <div className="project-card-links">
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

                {showAdminActions && (
                    <div>
                        <button type="button" onClick={onEdit}>
                            Edit
                        </button>

                        <button type="button" onClick={onDelete}>
                            Delete
                        </button>

                        <button type="button" onClick={onManageImages}>
                            Images
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}

export default ProjectCard;