type ErrorStateProps = {
    message: string;
};

function ErrorState({ message }: ErrorStateProps) {
    return <p>{message}</p>;
}

export default ErrorState;