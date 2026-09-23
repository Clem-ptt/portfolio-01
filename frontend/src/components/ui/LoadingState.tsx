type LoadingStateProps = {
    message?: string;
};

function LoadingState({
    message = "Loading...",
}: LoadingStateProps) {
    return <p>{message}</p>;
}

export default LoadingState;