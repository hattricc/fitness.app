// src/modules/auth/ui/AuthProvider.tsx

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { AuthConfig, AuthOAuthParams, AuthState } from "../domain/ports";
import { AuthService } from "../application/auth.service";

export type AuthContextValue = AuthState & {
    actions: {
        signInWithGoogle: (params?: AuthOAuthParams) => Promise<void>;
        signInWithPassword: (email: string, password: string) => Promise<void>;
        signUpWithPassword: (email: string, password: string) => Promise<void>;
        signOut: () => Promise<void>;
        refresh: () => Promise<void>;
    };
};

const AuthContext = createContext<AuthContextValue | null>(null);

export type AuthProviderProps = {
    config: AuthConfig;
    children: React.ReactNode;
};

export function AuthProvider({ config, children }: AuthProviderProps) {
    const serviceRef = useRef<AuthService | null>(null);

    if (!serviceRef.current) {
        serviceRef.current = new AuthService(config);
    }

    const service = serviceRef.current;

    const [state, setState] = useState<AuthState>(() => service.getState());

    useEffect(() => {
        let unsub: (() => void) | null = null;
        let alive = true;

        (async () => {
            await service.init();
            if (!alive) return;
            unsub = service.subscribe(setState);
        })();

        return () => {
            alive = false;
            unsub?.();
            // Do NOT dispose service on unmount unless you truly want to drop session state.
            // If you do want that behavior, call: service.dispose()
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [service]);

    const actions = useMemo(
        () => ({
            signInWithGoogle: (params?: AuthOAuthParams) => service.signInWithGoogle(params),
            signInWithPassword: (email: string, password: string) => service.signInWithPassword(email, password),
            signUpWithPassword: (email: string, password: string) => service.signUpWithPassword(email, password),
            signOut: () => service.signOut(),
            refresh: () => service.refresh(),
        }),
        [service]
    );

    const value: AuthContextValue = useMemo(
        () => ({
            ...state,
            actions,
        }),
        [state, actions]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within <AuthProvider />");
    }
    return ctx;
}
