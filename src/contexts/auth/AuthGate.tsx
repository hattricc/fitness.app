// src/contexts/auth/AuthGate.tsx
import { ReactNode } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/contexts/auth/AuthProvider";

export function AuthGate({ children }: { children: ReactNode }) {
    const { authLoading, subscriptionLoading } = useAuth();

    if (authLoading || subscriptionLoading) {
        return (
            <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    return <>{children}</>;
}
