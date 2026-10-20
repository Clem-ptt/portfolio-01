import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../api/auth";
import LoadingState from "../../components/ui/LoadingState";

type ProtectedRouteProps = {
    children: React.ReactNode;
};

const ProtectedRoute = ({
    children,
}: ProtectedRouteProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const checkAuth = async () => {
            try {
                await getCurrentUser();

                if (!cancelled) {
                    setIsAuthenticated(true);
                }
            } catch {
                if (!cancelled) {
                    setIsAuthenticated(false);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        void checkAuth();

        return () => {
            cancelled = true;
        };
    }, []);

    if (isLoading) {
        return (
            <LoadingState message="Checking authentication..." />
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedRoute;