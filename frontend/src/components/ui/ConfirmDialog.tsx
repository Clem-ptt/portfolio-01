type ConfirmDialogProps = {
    title: string;
    message: string;
    confirmLabel?: string;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

function ConfirmDialog({
    title,
    message,
    confirmLabel = "Delete",
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <div
            className="admin-dialog-backdrop confirm-dialog-backdrop"
            role="presentation"
            onKeyDown={(event) => {
                if (event.key === "Escape") {
                    event.stopPropagation();

                    if (!isLoading) {
                        onCancel();
                    }
                }
            }}
        >
            <section
                className="admin-dialog confirm-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-message"
                tabIndex={-1}
            >
                <div className="confirm-dialog-icon" aria-hidden="true">
                    !
                </div>

                <h2 id="confirm-dialog-title">{title}</h2>

                <p id="confirm-dialog-message">{message}</p>

                <footer className="confirm-dialog-actions">
                    <button
                        className="admin-secondary-button"
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-dialog-delete-button"
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : confirmLabel}
                    </button>
                </footer>
            </section>
        </div>
    );
}

export default ConfirmDialog;