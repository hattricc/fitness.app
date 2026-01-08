// src/modules/auth/domain/errors.ts

import type { AuthError, AuthErrorCode } from "./ports";

/**
 * Factory to create normalized AuthError objects.
 * UI should only handle these normalized errors (never raw Supabase/HTTP errors).
 */
export function createAuthError(
    code: AuthErrorCode,
    message: string,
    options?: { status?: number; cause?: unknown }
): AuthError {
    return {
        code,
        message,
        status: options?.status,
        cause: options?.cause,
    };
}

export function isAuthError(value: unknown): value is AuthError {
    if (!value || typeof value !== "object") return false;
    const v = value as Partial<AuthError>;
    return typeof v.code === "string" && typeof v.message === "string";
}

/**
 * Default user-facing messages (safe to show in UI).
 * You can override these in the UI layer if you want more contextual messages.
 */
export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
    AuthInvalidCredentials: "Credenciales inválidas.",
    AuthEmailNotConfirmed: "Tu correo aún no fue confirmado.",
    AuthUserAlreadyExists: "Ya existe una cuenta con ese correo.",
    AuthOAuthFailed: "No se pudo iniciar sesión con Google.",
    AuthNetworkError: "Error de red. Intenta nuevamente.",
    AuthRateLimited: "Demasiados intentos. Intenta más tarde.",
    AuthUnknownError: "Ocurrió un error inesperado.",
};

/**
 * Maps generic failures to a normalized AuthError.
 * Use this when you don't have a provider-specific mapping yet.
 */
export function normalizeUnknownAuthError(err: unknown): AuthError {
    if (isAuthError(err)) return err;

    // If it's an Error instance, keep message for logs but avoid leaking details to UI.
    const message =
        err instanceof Error ? err.message : AUTH_ERROR_MESSAGES.AuthUnknownError;

    return createAuthError("AuthUnknownError", message, { cause: err });
}
