type ErrorStateProps = {
    message: string;
    onRetry?: () => void;
};

function ErrorState({
    message,
    onRetry,
}: ErrorStateProps) {
    return (
        <div className="error-state" role="alert">
            <span className="error-state-icon" aria-hidden="true">
                !
            </span>
            <p>{message}</p>

            {onRetry && (
                <button
                    className="error-state-button"
                    type="button"
                    onClick={onRetry}
                >
                    Try Again
                </button>
            )}
        </div>
    );
}

export default ErrorState;