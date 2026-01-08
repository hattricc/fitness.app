// src/modules/auth/application/auth.service.ts

import type {
    AuthConfig,
    AuthOAuthParams,
    AuthPort,
    AuthState,
    AuthStateChangeEvent,
    Unsubscribe,
} from "../domain/ports";
import { validateAuthConfig } from "../domain/config";
import { SessionStore } from "./session.store";
import { createSupabaseAuthAdapter } from "../infrastructure/supabase/auth.adapter";
import { createCookieAuthAdapter } from "../infrastructure/cookie/auth.adapter";
import type { AuthSession, AuthUser } from "../domain/types";

import { fullLogout } from "./logout";

function createAuthAdapter(config: AuthConfig): AuthPort {
    validateAuthConfig(config);
    return config.mode === "supabase"
        ? createSupabaseAuthAdapter(config)
        : createCookieAuthAdapter(config);
}

export class AuthService {
    private readonly port: AuthPort;
    private readonly store: SessionStore;
    private unsub: Unsubscribe | null = null;
    private initialized = false;

    constructor(config: AuthConfig, store?: SessionStore) {
        this.port = createAuthAdapter(config);
        this.store = store ?? new SessionStore();
    }

    getState(): AuthState {
        return this.store.getState();
    }

    subscribe(listener: (state: AuthState) => void): Unsubscribe {
        return this.store.subscribe(listener);
    }

    /**
     * Call once on app startup (e.g., inside AuthProvider useEffect).
     * It hydrates current session and registers auth-change listener.
     */
    async init(): Promise<void> {
        if (this.initialized) return;
        this.initialized = true;

        this.store.setLoading();

        // 1) Hydrate current session
        const session = await this.safeGetSession();
        this.store.setFromSession(session);

        // 2) Listen to changes
        this.unsub = this.port.onAuthStateChange((event, nextSession) => {
            this.handleAuthEvent(event, nextSession);
        });
    }

    dispose(): void {
        this.unsub?.();
        this.unsub = null;
        this.initialized = false;
        this.store.setAnonymous();
    }

    // ----- Actions (delegate to port) -----

    async signInWithGoogle(params?: AuthOAuthParams): Promise<void> {
        await this.port.signInWithGoogle(params);
        // In supabase mode, redirect happens. In cookie mode, adapter may redirect too.
    }

    async signInWithPassword(email: string, password: string): Promise<void> {
        await this.port.signInWithPassword(email, password);
        // Session updates usually arrive via onAuthStateChange.
        // For safety, re-hydrate once after successful sign-in.
        const session = await this.safeGetSession();
        this.store.setFromSession(session);
    }

    async signUpWithPassword(email: string, password: string): Promise<void> {
        await this.port.signUpWithPassword(email, password);
        const session = await this.safeGetSession();
        this.store.setFromSession(session);
    }

    async signOut(): Promise<void> {
        await this.port.signOut();
        await fullLogout(this.port);
        // Optimistic clear (in case listener is delayed)
        this.store.setAnonymous();
    }

    async refresh(): Promise<void> {
        const session = await this.safeGetSession();
        this.store.setFromSession(session);
    }

    async getUser(): Promise<AuthUser | null> {
        return await this.port.getUser();
    }

    // ----- Internals -----

    private handleAuthEvent(event: AuthStateChangeEvent, session: AuthSession | null): void {
        switch (event) {
            case "INITIAL_SESSION":
            case "SIGNED_IN":
            case "SIGNED_OUT":
            case "TOKEN_REFRESHED":
                this.store.setFromSession(session);
                break;
            case "USER_UPDATED":
                this.store.setFromSession(session);
                break;
            case "PASSWORD_RECOVERY":
            case "MFA_CHALLENGE_VERIFIED":
            default:
                // Default behavior: keep store aligned with latest session
                this.store.setFromSession(session);
                break;
        }
    }

    private async safeGetSession(): Promise<AuthSession | null> {
        try {
            return await this.port.getSession();
        } catch {
            // If session retrieval fails, treat as anonymous (avoid locking app in loading)
            return null;
        }
    }
}
