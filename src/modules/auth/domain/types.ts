// src/modules/auth/domain/types.ts
export type AuthStatus = "loading" | "authenticated" | "anonymous";

export type AuthUser = {
    id: string;
    email?: string;
    phone?: string;
    role?: string;
    appMetadata?: Record<string, unknown>;
    userMetadata?: Record<string, unknown>;
};

export type AuthSession = {
    /**
     * In "cookie" mode these may be absent because tokens are not exposed to JS.
     * Keep them optional to avoid coupling the rest of the app to token presence.
     */
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number; // epoch seconds
    user: AuthUser;
};
