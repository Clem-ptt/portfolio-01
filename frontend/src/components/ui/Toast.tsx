import { useEffect } from "react";

export type ToastType = "success" | "error";

type ToastProps = {
    type: ToastType;
    message: string;
    onClose: () => void;
};

const Toast = ({ type, message, onClose }: ToastProps) => {
    useEffect(() => {
        const timeout = window.setTimeout(onClose, type === "error" ? 6000 : 3500);

        return () => window.clearTimeout(timeout);
    }, [message, type, onClose]);

    return (
        <div
            className={`toast toast-${type}`}
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
        >
            <span className="toast-message">{message}</span>
            <button
                type="button"
                className="toast-close"
                onClick={onClose}
                aria-label="Dismiss notification"
            >
                ×
            </button>
        </div>
    );
};

export default Toast;