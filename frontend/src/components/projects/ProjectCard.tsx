import { Link } from "react-router-dom";
import type { Project } from "../../types/project";

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
    onManageImages
}: ProjectCardProps) {
    return (
        <article className="project-card">
            {project.imageUrl && (
                <img
                    className="project-card-image"
                    src={project.imageUrl}
                    alt={project.title}
                />
            )}

            <h2>
                <Link to={`/projects/${project.slug}`}>
                    {project.title}
                </Link>
            </h2>

            <p>{project.description}</p>

            {project.featured && (
                <span>Featured</span>
            )}

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
                        <button
                            type="button"
                            onClick={onEdit}
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={onDelete}
                        >
                            Delete
                        </button>

                        <button
                            type="button"
                            onClick={onManageImages}
                        >
                            Images
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}

export default ProjectCard;