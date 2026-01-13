import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef, useMemo } from 'react';
import { getUserWithSubscription, supabase } from '@/lib/supabase';
import { mapUserSession, UserSession, Subscription } from '@/lib/userSession';
import { Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: UserSession | null;
  supabaseSession: Session | null;
  subscription: Subscription | null;
  authLoading: boolean;
  subscriptionLoading: boolean;
  refreshSubscription: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const MANUAL_SESSION_KEY = "manual_supabase_session_v1";


async function restoreSessionFromLocalStorage() {
  try {
    const raw = localStorage.getItem(MANUAL_SESSION_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw);
    if (!parsed?.access_token || !parsed?.refresh_token) return false;

    const { data, error } = await supabase.auth.setSession({
      access_token: parsed.access_token,
      refresh_token: parsed.refresh_token,
    });

    if (error) {
      console.error("[auth] setSession error:", error);
      localStorage.removeItem(MANUAL_SESSION_KEY);
      return false;
    }

    return !!data.session;
  } catch (e) {
    console.error("[auth] restoreSession parse error:", e);
    localStorage.removeItem(MANUAL_SESSION_KEY);
    return false;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authLoading, setAuthLoading] = useState(true);
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserSession | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);


  // Evita llamadas repetidas de subscription si hay eventos seguidos
  const subFetchInFlight = useRef<Promise<void> | null>(null);
  const lastUserIdRef = useRef<string | null>(null);

  const persistUser = (u: UserSession | null) => {
    if (u) localStorage.setItem("userSession", JSON.stringify(u));
    else localStorage.removeItem("userSession");
  };

  const clearAll = () => {
    setSupabaseSession(null);
    setUser(null);
    setSubscription(null);
    persistUser(null);
  };

  const fetchAndSetSubscription = async (userId: string) => {
    // dedupe
    if (subFetchInFlight.current) return subFetchInFlight.current;

    subFetchInFlight.current = (async () => {
      try {
        const sub = await getUserWithSubscription(userId);
        setSubscription(sub ?? null);
      } catch (e) {
        console.error("getUserWithSubscription error:", e);
        setSubscription(null);
      } finally {
        subFetchInFlight.current = null;
      }
    })();

    return subFetchInFlight.current;
  };

  const applySession = async (event: string, session: Session | null) => {
    setSupabaseSession(session);

    // Solo limpiar definitivo si realmente se firmó out
    if (event === "SIGNED_OUT") {
      clearAll();
      setSubscriptionLoading(false);
      setAuthLoading(false);
      return;
    }

    if (!session?.user) {
      setSubscription(null);
      setSubscriptionLoading(false);
      setAuthLoading(false);
      return;
    }

    const currentUser = mapUserSession(session.user, null);
    setUser(currentUser);
    persistUser(currentUser);

    if (lastUserIdRef.current !== currentUser?.id) {
      lastUserIdRef.current = currentUser?.id ?? '';
      setSubscriptionLoading(true);
      await fetchAndSetSubscription(currentUser?.id ?? '');
      setSubscriptionLoading(false);
    }

    setAuthLoading(false);
  };


  useEffect(() => {
    let mounted = true;

    // 1) intenta sesión normal
    supabase.auth.getSession().then(async ({ data, error }) => {
      if (!mounted) return;
      if (error) console.error("getSession error:", error);

      // 2) si no hay sesión, intenta restaurar manualmente
      if (!data.session) {
        const restored = await restoreSessionFromLocalStorage();
        if (!restored) {
          await applySession("INITIAL_SESSION", null);
          return;
        }

        const again = await supabase.auth.getSession();
        await applySession("INITIAL_SESSION", again.data.session ?? null);
        return;
      }

      await applySession("INITIAL_SESSION", data.session ?? null);
    });

    // 2) listener único
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await applySession(_event, session ?? null);

      if (_event === "SIGNED_OUT") {
        localStorage.removeItem(MANUAL_SESSION_KEY);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const refreshSubscription = async () => {
    if (!user?.id) return;
    await fetchAndSetSubscription(user.id);
  };



  const signInWithEmail = async (email: string, password: string) => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setAuthLoading(false);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    setAuthLoading(false);
  };

  const signInWithGoogle = async () => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // redirectTo: `${window.location.origin}/dashboard`,
        // redirectTo: `http://localhost:3000/auth/callback`,
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    setAuthLoading(false);
  };

  const signOut = async () => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setAuthLoading(false);
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    supabaseSession,
    subscription,
    authLoading,
    subscriptionLoading,
    refreshSubscription,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  }), [
    user,
    supabaseSession,
    subscription,
    authLoading,
    subscriptionLoading,
    refreshSubscription,
  ]);



  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

