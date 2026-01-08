// Punto 18 - complemento) src/app/config/env.ts
// Optional: centralize env parsing so AppProviders stays clean.
// Use this if you want the app to own env concerns and keep modules portable.

import type { AuthConfig } from "@/modules/auth";

export function getAuthConfig(): AuthConfig {
    // If you prefer portability, avoid this approach and inject config from outside Vite.
    const mode = (import.meta.env.VITE_AUTH_MODE as "supabase" | "cookie" | undefined) ?? "supabase";

    return {
        mode,
        debug: import.meta.env.VITE_AUTH_DEBUG === "true",
        storageKey: import.meta.env.VITE_AUTH_STORAGE_KEY || undefined,
        supabase:
            mode === "supabase"
                ? {
                    url: import.meta.env.VITE_SUPABASE_URL as string,
                    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
                    redirectTo: import.meta.env.VITE_AUTH_REDIRECT_TO || undefined,
                }
                : undefined,
        cookie:
            mode === "cookie"
                ? {
                    baseUrl: import.meta.env.VITE_AUTH_COOKIE_BASE_URL as string,
                }
                : undefined,
    };
}
