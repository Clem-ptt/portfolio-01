import type { ReactNode } from "react";

type PageContainerProps = {
    children: ReactNode;
    className?: string;
};

function PageContainer({
    children,
    className = "",
}: PageContainerProps) {
    return (
        <div className={`page-container ${className}`.trim()}>
            {children}
        </div>
    );
}

export default PageContainer;