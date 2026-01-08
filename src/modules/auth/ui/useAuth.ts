// src/modules/auth/ui/useAuth.ts

import { useAuthContext } from "./AuthProvider";

/**
 * Single consumption point for auth state + actions.
 * App code should import { useAuth } from "@/modules/auth".
 */
export function useAuth() {
    return useAuthContext();
}
