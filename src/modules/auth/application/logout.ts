// Punto 20) src/modules/auth/application/logout.ts
// Centralized "logout completo" behavior for option 1.
// This is optional but recommended so you have one place to harden later.

import type { AuthPort } from "../domain/ports";
import { AUTH_RETURN_TO_KEY } from "../domain/oauth";

/**
 * Clears local artifacts that might keep users "stuck" in a loop.
 * In supabase mode, AuthPort.signOut() already clears persisted session.
 * In cookie mode later, this will call backend logout endpoint.
 */
export async function fullLogout(auth: AuthPort): Promise<void> {
    // Remove any stored returnTo
    try {
        sessionStorage.removeItem(AUTH_RETURN_TO_KEY);
    } catch {
        // ignore
    }

    // Provider sign out (Supabase clears local session; cookie mode will clear cookie server-side later)
    await auth.signOut();

    // Optional: if you later add BroadcastChannel or other caches, clear them here.
}
