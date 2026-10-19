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
        <article className="technology-card">
            {technology.iconUrl ? (
                <img
                    className="technology-card-icon"
                    src={technology.iconUrl}
                    alt={`${technology.name} icon`}
                    loading="lazy"
                />
            ) : (
                <div
                    className="technology-card-icon-placeholder"
                    aria-hidden="true"
                >
                    {technology.name.charAt(0).toUpperCase()}
                </div>
            )}

            <h2 className="technology-card-name">
                {technology.name}
            </h2>

            <span className="technology-card-category">
                {technology.category}
            </span>

            {showAdminActions && (
                <div className="technology-card-actions">
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
                </div>
            )}
        </article>
    );
}

export default TechnologyCard;