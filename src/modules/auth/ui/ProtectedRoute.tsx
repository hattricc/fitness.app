// Punto 14) src/modules/auth/ui/ProtectedRoute.tsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

export type ProtectedRouteProps = {
    /**
     * Where to send anonymous users.
     */
    redirectTo?: string;

    /**
     * Optional custom loader while auth is hydrating.
     */
    loadingFallback?: React.ReactNode;

    /**
     * If you prefer to wrap children instead of using <Outlet/>.
     */
    children?: React.ReactNode;
};

export function ProtectedRoute({
    redirectTo = "/login",
    loadingFallback = null,
    children,
}: ProtectedRouteProps) {
    const { status } = useAuth();

    if (status === "loading") return <>{loadingFallback}</>;

    if (status === "anonymous") {
        return <Navigate to={redirectTo} replace />;
    }

    // authenticated
    return children ? <>{children}</> : <Outlet />;
}
