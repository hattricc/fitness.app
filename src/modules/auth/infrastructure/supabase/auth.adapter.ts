// Punto 8) src/modules/auth/infrastructure/supabase/auth.adapter.ts

import type {
    AuthOAuthParams,
    AuthPort,
    AuthStateChangeEvent,
    AuthConfig,
    Unsubscribe,
} from "../../domain/ports";
import type { AuthSession, AuthUser } from "../../domain/types";
import { createAuthError, normalizeUnknownAuthError, AUTH_ERROR_MESSAGES } from "../../domain/errors";
import { validateAuthConfig } from "../../domain/config";
import { getSupabaseClient } from "./client";

/**
 * Maps Supabase session/user -> domain session/user (portable).
 */
function mapUser(sbUser: any): AuthUser {
    return {
        id: sbUser.id,
        email: sbUser.email ?? undefined,
        phone: sbUser.phone ?? undefined,
        role: sbUser.role ?? undefined,
        appMetadata: sbUser.app_metadata ?? undefined,
        userMetadata: sbUser.user_metadata ?? undefined,
    };
}

function mapSession(sbSession: any): AuthSession {
    return {
        accessToken: sbSession.access_token ?? undefined,
        refreshToken: sbSession.refresh_token ?? undefined,
        expiresAt: sbSession.expires_at ?? undefined,
        user: mapUser(sbSession.user),
    };
}

/**
 * Best-effort mapping of Supabase errors -> normalized AuthError codes.
 * Extend this mapping as you encounter cases.
 */
function mapSupabaseError(err: any) {
    const msg: string = err?.message ?? AUTH_ERROR_MESSAGES.AuthUnknownError;
    const status: number | undefined = err?.status;

    // Supabase error codes/messages vary; keep conservative mappings.
    const lower = msg.toLowerCase();

    if (status === 400 && (lower.includes("invalid login") || lower.includes("invalid") || lower.includes("credentials"))) {
        return createAuthError("AuthInvalidCredentials", AUTH_ERROR_MESSAGES.AuthInvalidCredentials, { status, cause: err });
    }

    if (lower.includes("email not confirmed") || lower.includes("confirm your email")) {
        return createAuthError("AuthEmailNotConfirmed", AUTH_ERROR_MESSAGES.AuthEmailNotConfirmed, { status, cause: err });
    }

    if (lower.includes("user already registered") || lower.includes("already been registered") || lower.includes("already exists")) {
        return createAuthError("AuthUserAlreadyExists", AUTH_ERROR_MESSAGES.AuthUserAlreadyExists, { status, cause: err });
    }

    if (status === 429 || lower.includes("rate limit")) {
        return createAuthError("AuthRateLimited", AUTH_ERROR_MESSAGES.AuthRateLimited, { status, cause: err });
    }

    if (lower.includes("oauth") || lower.includes("provider")) {
        return createAuthError("AuthOAuthFailed", AUTH_ERROR_MESSAGES.AuthOAuthFailed, { status, cause: err });
    }

    if (lower.includes("network") || lower.includes("fetch")) {
        return createAuthError("AuthNetworkError", AUTH_ERROR_MESSAGES.AuthNetworkError, { status, cause: err });
    }

    return createAuthError("AuthUnknownError", msg, { status, cause: err });
}

function mapEvent(event: string): AuthStateChangeEvent {
    // Supabase emits: 'INITIAL_SESSION', 'SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED', 'USER_UPDATED', 'PASSWORD_RECOVERY', etc.
    // Keep only the union you defined; fallback to USER_UPDATED to stay inside type.
    const allowed = new Set<AuthStateChangeEvent>([
        "INITIAL_SESSION",
        "SIGNED_IN",
        "SIGNED_OUT",
        "TOKEN_REFRESHED",
        "USER_UPDATED",
        "PASSWORD_RECOVERY",
        "MFA_CHALLENGE_VERIFIED",
    ]);
    return (allowed.has(event as AuthStateChangeEvent) ? (event as AuthStateChangeEvent) : "USER_UPDATED");
}

export function createSupabaseAuthAdapter(config: AuthConfig): AuthPort {
    validateAuthConfig(config);

    if (config.mode !== "supabase") {
        throw new Error("createSupabaseAuthAdapter requires mode='supabase'.");
    }

    const supabase = getSupabaseClient(config);

    return {
        async getSession(): Promise<AuthSession | null> {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) throw mapSupabaseError(error);
                const sbSession = data?.session;
                return sbSession ? mapSession(sbSession) : null;
            } catch (err) {
                throw normalizeUnknownAuthError(err);
            }
        },

        async getUser(): Promise<AuthUser | null> {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error) throw mapSupabaseError(error);
                const sbUser = data?.user;
                return sbUser ? mapUser(sbUser) : null;
            } catch (err) {
                throw normalizeUnknownAuthError(err);
            }
        },

        async signInWithGoogle(params?: AuthOAuthParams): Promise<void> {
            try {
                const redirectTo = params?.redirectTo ?? config.supabase?.redirectTo;
                const scopes = params?.scopes?.join(" ");

                const { error } = await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                        redirectTo,
                        scopes,
                    },
                });

                if (error) throw mapSupabaseError(error);
            } catch (err) {
                throw normalizeUnknownAuthError(err);
            }
        },

        async signInWithPassword(email: string, password: string): Promise<void> {
            try {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw mapSupabaseError(error);
            } catch (err) {
                throw normalizeUnknownAuthError(err);
            }
        },

        async signUpWithPassword(email: string, password: string): Promise<void> {
            try {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw mapSupabaseError(error);
            } catch (err) {
                throw normalizeUnknownAuthError(err);
            }
        },

        async signOut(): Promise<void> {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) throw mapSupabaseError(error);
            } catch (err) {
                throw normalizeUnknownAuthError(err);
            }
        },

        onAuthStateChange(
            callback: (event: AuthStateChangeEvent, session: AuthSession | null) => void
        ): Unsubscribe {
            const { data } = supabase.auth.onAuthStateChange((event, sbSession) => {
                callback(mapEvent(event), sbSession ? mapSession(sbSession) : null);
            });

            return () => {
                data.subscription.unsubscribe();
            };
        },
    };
}
