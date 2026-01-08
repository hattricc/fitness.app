// Punto 15) (Contrato + constantes para flujo OAuth)
// src/modules/auth/domain/oauth.ts

/**
 * Recommended route constants for OAuth flows.
 * Keeping these in the module makes it portable and consistent.
 */
export const AUTH_ROUTES = {
    login: "/login",
    callback: "/auth/callback",
} as const;

/**
 * Key used to store a "returnTo" path before redirecting to OAuth provider.
 * This makes it possible to send the user back to their intended page after login.
 */
export const AUTH_RETURN_TO_KEY = "auth:return_to";
