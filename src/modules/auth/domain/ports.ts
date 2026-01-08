// src/modules/auth/domain/ports.ts
import type { AuthSession, AuthStatus, AuthUser } from "./types";

export type AuthMode = "supabase" | "cookie";

export type AuthConfig = {
    mode: AuthMode;

    /**
     * Used in "supabase" mode.
     */
    supabase?: {
        url: string;
        anonKey: string;
        /**
         * Default redirectTo for OAuth flows (can be overridden per call).
         */
        redirectTo?: string;
    };

    /**
     * Used in "cookie" mode.
     * baseUrl is your backend/edge endpoint that manages HttpOnly cookies.
     */
    cookie?: {
        baseUrl: string;
    };

    /**
     * Optional flags.
     */
    debug?: boolean;
    storageKey?: string;
};

export type AuthStateChangeEvent =
    | "INITIAL_SESSION"
    | "SIGNED_IN"
    | "SIGNED_OUT"
    | "TOKEN_REFRESHED"
    | "USER_UPDATED"
    | "PASSWORD_RECOVERY"
    | "MFA_CHALLENGE_VERIFIED";

export type Unsubscribe = () => void;

export type AuthOAuthParams = {
    /**
     * Override redirect destination for this call.
     */
    redirectTo?: string;

    /**
     * Provider-specific scopes. Keep generic for portability.
     */
    scopes?: string[];
};

export type AuthErrorCode =
    | "AuthInvalidCredentials"
    | "AuthEmailNotConfirmed"
    | "AuthUserAlreadyExists"
    | "AuthOAuthFailed"
    | "AuthNetworkError"
    | "AuthRateLimited"
    | "AuthUnknownError";

export type AuthError = {
    code: AuthErrorCode;
    message: string;
    status?: number;
    cause?: unknown;
};

export type AuthState = {
    status: AuthStatus;
    session: AuthSession | null;
    user: AuthUser | null;
};

export interface AuthPort {
    /**
     * Returns the current session if available, otherwise null.
     * Must be safe to call on app startup.
     */
    getSession(): Promise<AuthSession | null>;

    /**
     * Convenience getter. May derive from session internally.
     */
    getUser(): Promise<AuthUser | null>;

    /**
     * OAuth sign-in. For Supabase mode it triggers provider redirect.
     * For cookie mode it may redirect to your backend OAuth start route.
     */
    signInWithGoogle(params?: AuthOAuthParams): Promise<void>;

    /**
     * Email/password sign-in.
     */
    signInWithPassword(email: string, password: string): Promise<void>;

    /**
     * Email/password sign-up (optional in some apps but recommended to keep in port).
     */
    signUpWithPassword(email: string, password: string): Promise<void>;

    /**
     * Signs out the user and clears local session state.
     */
    signOut(): Promise<void>;

    /**
     * Subscribe to auth state changes.
     * Must return an unsubscribe function.
     */
    onAuthStateChange(
        callback: (event: AuthStateChangeEvent, session: AuthSession | null) => void
    ): Unsubscribe;
}
