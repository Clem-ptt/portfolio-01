import { useNavigate } from "react-router-dom";

type BackButtonProps = {
    label?: string;
    to?: string;
};

function BackButton({
    label = "Back",
    to,
}: BackButtonProps) {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            className="back-button"
            onClick={() => {
                if (to) {
                    navigate(to);
                } else {
                    navigate(-1);
                }
            }}
        >
            <span aria-hidden="true">←</span>
            {label}
        </button>
    );
}

export default BackButton;