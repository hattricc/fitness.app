// Punto 17) src/modules/auth/ui/pages/AuthCallbackPage.tsx
// Handles post-OAuth redirect finalization and returns user to intended page.

import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import { AUTH_RETURN_TO_KEY } from "../../domain/oauth";

export function AuthCallbackPage() {
    const { status, actions } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // In Supabase mode, detectSessionInUrl=true should finalize automatically.
        // Still, do a refresh to ensure state is in sync after the redirect.
        (async () => {
            await actions.refresh();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (status === "loading") return;

        const returnTo = sessionStorage.getItem(AUTH_RETURN_TO_KEY);

        if (status === "authenticated") {
            if (returnTo) {
                sessionStorage.removeItem(AUTH_RETURN_TO_KEY);
                navigate(returnTo, { replace: true });
                return;
            }
            navigate("/", { replace: true });
            return;
        }

        // If still anonymous after callback, send to login with returnTo
        const safeReturnTo =
            returnTo ||
            new URLSearchParams(location.search).get("returnTo") ||
            "/";

        navigate(`/login?returnTo=${encodeURIComponent(safeReturnTo)}`, { replace: true });
    }, [status, navigate, location.search]);

    return (
        <div style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
            <h1>Finalizando inicio de sesión…</h1>
            <p>Si esto tarda demasiado, vuelve a intentar desde el login.</p>
        </div>
    );
}
