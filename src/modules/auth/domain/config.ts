// src/modules/auth/domain/config.ts

import type { AuthConfig } from "./ports";

/**
 * Runtime validation for AuthConfig.
 * Keep this small and dependency-free so the module stays portable.
 */
export function validateAuthConfig(config: AuthConfig): void {
    if (!config || typeof config !== "object") {
        throw new Error("AuthConfig is required.");
    }

    if (config.mode !== "supabase" && config.mode !== "cookie") {
        throw new Error(`Invalid auth mode: ${String((config as any).mode)}`);
    }

    if (config.mode === "supabase") {
        const sb = config.supabase;
        if (!sb?.url || !sb?.anonKey) {
            throw new Error(
                "AuthConfig.supabase.url and AuthConfig.supabase.anonKey are required when mode='supabase'."
            );
        }
    }

    if (config.mode === "cookie") {
        const ck = config.cookie;
        if (!ck?.baseUrl) {
            throw new Error(
                "AuthConfig.cookie.baseUrl is required when mode='cookie'."
            );
        }
    }
}

/**
 * Optional helper to build AuthConfig from environment variables.
 * Use this ONLY if you are fine with Vite coupling.
 * Otherwise, inject AuthConfig from the app layer manually.
 */
export function authConfigFromViteEnv(env: ImportMetaEnv): AuthConfig {
    const mode = (env.VITE_AUTH_MODE as "supabase" | "cookie" | undefined) ?? "supabase";

    const config: AuthConfig = {
        mode,
        debug: env.VITE_AUTH_DEBUG === "true",
        storageKey: env.VITE_AUTH_STORAGE_KEY || undefined,
    };

    if (mode === "supabase") {
        config.supabase = {
            url: env.VITE_SUPABASE_URL as string,
            anonKey: env.VITE_SUPABASE_ANON_KEY as string,
            redirectTo: env.VITE_AUTH_REDIRECT_TO || undefined,
        };
    } else {
        config.cookie = {
            baseUrl: env.VITE_AUTH_COOKIE_BASE_URL as string,
        };
    }

    // Fail fast if env is incomplete
    validateAuthConfig(config);

    return config;
}
