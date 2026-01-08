// Punto 16) src/modules/auth/ui/pages/LoginPage.tsx
// Minimal, portable page. Replace markup with your design system.

import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import { AUTH_RETURN_TO_KEY } from "../../domain/oauth";
import type { AuthError } from "../../domain/ports";

export function LoginPage() {
    const { status, actions } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<AuthError | null>(null);

    // If already authenticated, go home (or returnTo if present)
    if (status === "authenticated") {
        const returnTo = sessionStorage.getItem(AUTH_RETURN_TO_KEY);
        if (returnTo) {
            sessionStorage.removeItem(AUTH_RETURN_TO_KEY);
            return <Navigate to={returnTo} replace />;
        }
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        // Capture intended path if redirected here from a protected route
        // (e.g., /login?returnTo=/dashboard)
        const params = new URLSearchParams(location.search);
        const returnTo = params.get("returnTo");
        if (returnTo) {
            sessionStorage.setItem(AUTH_RETURN_TO_KEY, returnTo);
        }
    }, [location.search]);

    async function onEmailPasswordSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await actions.signInWithPassword(email.trim(), password);
            // After sign in, auth listener/service should update status.
            // Navigate will happen automatically by the early return above.
        } catch (err) {
            setError(err as AuthError);
        } finally {
            setSubmitting(false);
        }
    }

    async function onGoogle() {
        setSubmitting(true);
        setError(null);
        try {
            // Store returnTo for after OAuth redirect completes
            const params = new URLSearchParams(location.search);
            const returnTo = params.get("returnTo");
            if (returnTo) sessionStorage.setItem(AUTH_RETURN_TO_KEY, returnTo);

            await actions.signInWithGoogle();
            // In supabase mode, this usually triggers a redirect immediately.
        } catch (err) {
            setError(err as AuthError);
            setSubmitting(false);
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
            <h1>Iniciar sesión</h1>

            <button type="button" onClick={onGoogle} disabled={submitting} style={{ width: "100%", marginTop: 12 }}>
                Continuar con Google
            </button>

            <hr style={{ margin: "16px 0" }} />

            <form onSubmit={onEmailPasswordSubmit}>
                <label style={{ display: "block", marginBottom: 8 }}>
                    Email
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        autoComplete="email"
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </label>

                <label style={{ display: "block", marginBottom: 8 }}>
                    Contraseña
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        autoComplete="current-password"
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </label>

                <button type="submit" disabled={submitting} style={{ width: "100%", marginTop: 8 }}>
                    Entrar
                </button>
            </form>

            {error ? (
                <p style={{ marginTop: 12 }}>
                    {error.message}
                </p>
            ) : null}

            {status === "loading" ? <p style={{ marginTop: 12 }}>Cargando sesión...</p> : null}

            <button
                type="button"
                onClick={() => navigate("/")}
                style={{ marginTop: 16 }}
            >
                Volver
            </button>
        </div>
    );
}
