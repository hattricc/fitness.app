// Punto 7) src/modules/auth/infrastructure/supabase/client.ts

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AuthConfig } from "../../domain/ports";
import { validateAuthConfig } from "../../domain/config";

/**
 * Supabase client must live ONLY inside infrastructure.
 * No other layer should import @supabase/supabase-js directly.
 */
let _client: SupabaseClient | null = null;

export function getSupabaseClient(config: AuthConfig): SupabaseClient {
    validateAuthConfig(config);

    if (config.mode !== "supabase") {
        throw new Error("getSupabaseClient can only be used when mode='supabase'.");
    }
    if (_client) return _client;

    const { url, anonKey, redirectTo } = config.supabase!;

    _client = createClient(url, anonKey, {
        auth: {
            // Option 1: allow Supabase to persist the session in browser storage
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            // Optional: helps ensure redirect URL is consistent
            // Note: Supabase doesn't require redirectTo here; it is passed per signIn call
        },
        global: {
            headers: {
                "X-Client-Info": "modules/auth",
            },
        },
    });

    // If you want a single place to control redirectTo, keep it in config and pass it in adapter.
    void redirectTo; // prevent unused warnings if you don't use it yet.

    return _client;
}

/**
 * Useful for tests or re-init scenarios.
 */
export function resetSupabaseClientForTests(): void {
    _client = null;
}
