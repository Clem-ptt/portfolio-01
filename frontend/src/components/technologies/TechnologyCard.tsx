import type { Technology } from "../../types/technology";

type TechnologyCardProps = {
    technology: Technology;
    showAdminActions?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
};

function TechnologyCard({
    technology,
    showAdminActions = false,
    onEdit,
    onDelete,
}: TechnologyCardProps) {
    return (
        <article className="admin-technology-card">
            <div className="admin-technology-card-main">
                {technology.iconUrl ? (
                    <img
                        className="admin-technology-icon"
                        src={technology.iconUrl}
                        alt={`${technology.name} icon`}
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="admin-technology-icon-placeholder"
                        aria-hidden="true"
                    >
                        {technology.name.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="admin-technology-info">
                    <h3>{technology.name}</h3>
                    <span className="admin-technology-category">
                        {technology.category}
                    </span>
                </div>
            </div>

            {showAdminActions && (
                <div className="admin-technology-actions">
                    <button
                        className="admin-secondary-button"
                        type="button"
                        onClick={onEdit}
                    >
                        Edit
                    </button>

                    <button
                        className="admin-danger-outline-button"
                        type="button"
                        onClick={onDelete}
                    >
                        Delete
                    </button>
                </div>
            )}
        </article>
    );
}

export default TechnologyCard;