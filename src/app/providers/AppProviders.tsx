// Punto 18) src/app/providers/AppProviders.tsx
// Integrates AuthProvider (module) at app level without coupling app to Supabase internals.

import React from "react";
import { AuthProvider, type AuthConfig } from "@/modules/auth";
import { authConfigFromViteEnv } from "@/modules/auth/domain/config";

export function AppProviders({ children }: { children: React.ReactNode }) {
    // Option A (portable): build this config in app/config and pass it here.
    // Option B (Vite-coupled): build from import.meta.env (used below).
    const authConfig: AuthConfig = authConfigFromViteEnv(import.meta.env);

    return <AuthProvider config={authConfig}>{children}</AuthProvider>;
}
