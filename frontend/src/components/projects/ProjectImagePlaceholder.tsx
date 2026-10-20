type ProjectImagePlaceholderProps = {
    className: string;
};

function ProjectImagePlaceholder({
    className,
}: ProjectImagePlaceholderProps) {
    return (
        <div className={`${className} project-image-placeholder`}>
            <svg
                viewBox="0 0 48 48"
                width="48"
                height="48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <rect x="6" y="8" width="36" height="32" rx="3" />
                <circle cx="17" cy="18" r="3" />
                <path d="M7 33l11-10 8 7 5-5 10 10" />
            </svg>
            <span>No image available</span>
        </div>
    );
}

export default ProjectImagePlaceholder;