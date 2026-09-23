type ErrorStateProps = {
    message: string;
    onRetry?: () => void;
};

function ErrorState({
    message,
    onRetry,
}: ErrorStateProps) {
    return (
        <div>
            <p>{message}</p>

            {onRetry && (
                <button onClick={onRetry}>
                    Try Again
                </button>
            )}
        </div>
    );
}

export default ErrorState;