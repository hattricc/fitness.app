// src/modules/auth/index.ts
// Public API for the Auth module.
// The app should import ONLY from this file.

export type {
  AuthMode,
  AuthConfig,
  AuthErrorCode,
  AuthError,
  AuthOAuthParams,
  Unsubscribe,
  AuthStateChangeEvent,
  AuthPort,
} from "./domain/ports";
import type { AuthStatus, AuthSession, AuthUser } from "./domain/types";

// UI exports (React)
export { AuthProvider } from "./ui/AuthProvider";
export { useAuth } from "./ui/useAuth";
export { ProtectedRoute } from "./ui/ProtectedRoute";

// Optional UI pages (export only if you want portable pages too)
export { LoginPage } from "./ui/pages/LoginPage";
export { AuthCallbackPage } from "./ui/pages/AuthCallbackPage";
