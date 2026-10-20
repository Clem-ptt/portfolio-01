type EmptyStateProps = {
    message: string;
};

function EmptyState({
    message,
}: EmptyStateProps) {
    return (
        <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">
                —
            </span>
            <p>{message}</p>
        </div>
    );
}

export default EmptyState;