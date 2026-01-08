// Punto 9) src/modules/auth/infrastructure/cookie/auth.adapter.ts
// Placeholder for Option 3 (HttpOnly cookies). This file intentionally does NOT implement logic yet.

import type {
    AuthConfig,
    AuthOAuthParams,
    AuthPort,
    AuthStateChangeEvent,
    Unsubscribe,
} from "../../domain/ports";
import type { AuthSession, AuthUser } from "../../domain/types";
import { validateAuthConfig } from "../../domain/config";

export function createCookieAuthAdapter(config: AuthConfig): AuthPort {
    validateAuthConfig(config);

    if (config.mode !== "cookie") {
        throw new Error("createCookieAuthAdapter requires mode='cookie'.");
    }

    return {
        async getSession(): Promise<AuthSession | null> {
            throw new Error("Not implemented: cookie getSession()");
        },

        async getUser(): Promise<AuthUser | null> {
            throw new Error("Not implemented: cookie getUser()");
        },

        async signInWithGoogle(_params?: AuthOAuthParams): Promise<void> {
            throw new Error("Not implemented: cookie signInWithGoogle()");
        },

        async signInWithPassword(_email: string, _password: string): Promise<void> {
            throw new Error("Not implemented: cookie signInWithPassword()");
        },

        async signUpWithPassword(_email: string, _password: string): Promise<void> {
            throw new Error("Not implemented: cookie signUpWithPassword()");
        },

        async signOut(): Promise<void> {
            throw new Error("Not implemented: cookie signOut()");
        },

        onAuthStateChange(
            _callback: (event: AuthStateChangeEvent, session: AuthSession | null) => void
        ): Unsubscribe {
            // In cookie mode, you'd typically implement this via:
            // - emitting events when signIn/signOut happen, and/or
            // - polling/revalidation, and/or
            // - BroadcastChannel for multi-tab sync.
            throw new Error("Not implemented: cookie onAuthStateChange()");
        },
    };
}
