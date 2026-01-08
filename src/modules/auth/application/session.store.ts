// src/modules/auth/application/session.store.ts

import type { AuthState } from "../domain/ports";
import type { AuthSession, AuthUser } from "../domain/types";


type Listener = (state: AuthState) => void;

function deriveStateFromSession(session: AuthSession | null): AuthState {
    if (!session) {
        return { status: "anonymous", session: null, user: null };
    }
    return { status: "authenticated", session, user: session.user };
}

export class SessionStore {
    private state: AuthState = { status: "loading", session: null, user: null };
    private listeners = new Set<Listener>();

    getState(): AuthState {
        return this.state;
    }

    setLoading(): void {
        this.setState({ status: "loading", session: null, user: null });
    }

    setFromSession(session: AuthSession | null): void {
        this.setState(deriveStateFromSession(session));
    }

    setAnonymous(): void {
        this.setState({ status: "anonymous", session: null, user: null });
    }

    setUser(user: AuthUser | null): void {
        // Keep session as-is; update derived fields.
        const session = this.state.session;
        if (!user || !session) {
            this.setAnonymous();
            return;
        }
        this.setState({ status: "authenticated", session: { ...session, user }, user });
    }

    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        // Immediately publish current state to new subscriber
        listener(this.state);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private setState(next: AuthState): void {
        this.state = next;
        for (const l of this.listeners) l(this.state);
    }
}
