import { createContext, useContext, useEffect, useState, ReactNode, useRef, useMemo } from 'react';
import { getUserWithSubscription, supabase } from '@/lib/supabase';
import { mapUserSession, UserSession, PaymentAccess } from '@/lib/userSession';
import { Session } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/verifyToken';
import { getAccessFromEdge } from '@/lib/access';


type AuthContextType = {
  user: UserSession | null;
  supabaseSession: Session | null;
  subscription: PaymentAccess | null;
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
    console.log('restore session from local storage')
    const raw = localStorage.getItem(MANUAL_SESSION_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw);
    if (!parsed?.access_token || !parsed?.refresh_token) return false;

    const { data, error } = await supabase.auth.setSession({
      access_token: parsed.access_token,
      refresh_token: parsed.refresh_token,
    });

    if (data.session?.access_token) {
      try {
        await verifyToken(data.session.access_token);
      } catch (e) {
        console.error('[auth] verifyToken after restore failed:', e);
        localStorage.removeItem(MANUAL_SESSION_KEY);
        return false;
      }
    }

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
  const [subscription, setSubscription] = useState<PaymentAccess | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  // Add this flag at the top of AuthProvider
  const isManualSignOut = useRef(false);
  const mountedRef = useRef(true);
  const subReqIdRef = useRef(0);

  // Evita llamadas repetidas de subscription si hay eventos seguidos
  const subFetchInFlight = useRef<Promise<PaymentAccess | null> | null>(null);
  const lastUserIdRef = useRef<string>('');

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

  // const fetchAndSetSubscription = async (userId: string) => {
  const fetchAndSetSubscription = async (session: Session) => {
    // const fetchAndSetSubscription = async (userId: string): Promise<Subscription | null> => {
    // if (subFetchInFlight.current) return subFetchInFlight.current;

    // subFetchInFlight.current = (async () => {
    //   try {
    //     const sub = await getUserWithSubscription(userId) as Subscription;
    //     setSubscription(sub ?? null);
    //   } catch (e) {
    //     console.error("getUserWithSubscription error:", e);
    //     setSubscription(null);
    //   } finally {
    //     subFetchInFlight.current = null;
    //   }
    // })();

    // return subFetchInFlight.current;




    // if (subFetchInFlight.current) {
    //   console.log('[auth] Subscription fetch already in flight, waiting...');
    //   return subFetchInFlight.current;
    // }
    // subFetchInFlight.current = (async () => {
    //   try {
    //     console.log('[auth] Fetching subscription for userId:', userId);
    //     const sub = await getUserWithSubscription(userId);
    //     console.log('[auth] Subscription fetched:', sub);
    //     setSubscription(sub);
    //     return sub;
    //   } catch (e) {
    //     console.error("[auth] getUserWithSubscription error:", e);
    //     setSubscription(null);
    //     return null;
    //   } finally {
    //     subFetchInFlight.current = null;
    //   }
    // })();
    // return subFetchInFlight.current;




    if (subFetchInFlight.current) return subFetchInFlight.current;

    const reqId = ++subReqIdRef.current;

    subFetchInFlight.current = (async () => {
      try {
        // const sub = await getUserWithSubscription(userId);
        const sub = await getAccessFromEdge(session);
        if (reqId !== subReqIdRef.current) return null; // stale
        setSubscription(sub);
        return sub;
      } finally {
        subFetchInFlight.current = null;
      }
    })();

    return subFetchInFlight.current;

  };

  const applySession = async (event: string, session: Session | null) => {
    console.log('[auth] event:', event, 'hasSession:', !!session, 'hasToken:', !!session?.access_token);
    setSupabaseSession(session);

    if (event === "SIGNED_OUT") {
      clearAll();
      setSubscriptionLoading(false);
      setAuthLoading(false);
      return;
    }

    if (!session?.access_token || !session?.user) {
      // estado no autenticado
      clearAll();
      setSubscriptionLoading(false);
      setAuthLoading(false);
      return;
    }

    // // Solo limpiar definitivo si realmente se firmó out
    // if (event === "SIGNED_OUT") {
    //   clearAll();
    //   setSubscriptionLoading(false);
    //   setAuthLoading(false);
    //   return;
    // }

    // if (!session?.access_token) {
    //   setSubscription(null);
    //   setSubscriptionLoading(false);
    //   setAuthLoading(false);
    //   return;
    // }


    // 1) Verifica el token con Supabase
    let verifiedUser = null;
    try {
      verifiedUser = await verifyToken(session.access_token);
    } catch (e) {
      console.error('[auth] verifyToken failed:', e);
      // Token inválido o sesión inconsistente => limpiar todo
      clearAll();
      setSubscriptionLoading(false);
      setAuthLoading(false);
      return;
    }

    // console.log('[auth] verifiedUserId:', verifiedUser?.id);


    // 2) Usa el usuario verificado (fuente de verdad)
    const currentUser = mapUserSession(verifiedUser, null);
    setUser(currentUser);
    persistUser(currentUser);
    console.log('[auth] Mapped user:', currentUser);


    // 3) Check if user changed and fetch subscription
    const SHOULD_FETCH_SUBSCRIPTION =
      lastUserIdRef.current !== currentUser.id;

    if (SHOULD_FETCH_SUBSCRIPTION) {
      console.log('[auth] User changed, fetching subscription for:', currentUser?.id);
      lastUserIdRef.current = currentUser.id ?? '';
      setSubscriptionLoading(true);

      // Fetch subscription first
      const subscription = await fetchAndSetSubscription(session);
      console.log('[auth] Subscription fetched:', subscription);

      // Then map user session with subscription
      const userWithSubscription = mapUserSession(verifiedUser, subscription);
      console.log('[auth] Final user with subscription:', userWithSubscription);

      setUser(userWithSubscription);
      persistUser(userWithSubscription);
      setSubscriptionLoading(false);
    }

    setAuthLoading(false);
  };

  const handleSession = async () => {

    console.log('handleSession')

    // 1) intenta sesión normal
    supabase.auth.getSession().then(async ({ data, error }) => {
      console.log('getSession resolved');
      console.log('getSession data:', data);
      console.log('getSession error:', error);

      // let mounted = true;

      if (!mountedRef.current) return;
      // if (!mounted) return;
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
  }


  const addListener = async () => {
    // // 2) listener único
    // const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
    //   await applySession(_event, session ?? null);

    //   // Save session to localStorage when user signs in
    //   if (_event === 'SIGNED_IN' && session) {
    //     console.log('[auth] Saving session after sign in');
    //     localStorage.setItem(
    //       MANUAL_SESSION_KEY,
    //       JSON.stringify({
    //         access_token: session.access_token,
    //         refresh_token: session.refresh_token,
    //         expires_at: session.expires_at,
    //         user: { id: session.user?.id },
    //         saved_at: Date.now(),
    //       })
    //     );
    //   }

    //   if (_event === "SIGNED_OUT") {
    //     console.log('[auth] User signed out');
    //     localStorage.removeItem(MANUAL_SESSION_KEY);
    //   }
    // });
    const DEBUG_AUTH = false; // Set to true for detailed logging
    // Then in your listener, add more detailed logs
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (DEBUG_AUTH) {
        console.log('=== AUTH DEBUG ===');
        console.log('Event:', _event);
        console.log('Session exists:', !!session);
        console.log('Session user:', session?.user?.id);
        console.log('Manual sign out flag:', isManualSignOut.current);
        console.log('Current user in context:', user?.id);
        console.log('===================');
      }

      // Skip processing if this is a manual sign out
      if (isManualSignOut.current) {
        if (DEBUG_AUTH) console.log('Skipping listener due to manual sign out');
        return;
      }

      await applySession(_event, session ?? null);
      if (_event === "SIGNED_OUT") {
        if (DEBUG_AUTH) console.log('[auth] User signed out via listener');
        localStorage.removeItem(MANUAL_SESSION_KEY);
      }
    });

    // Make sure to return the unsubscribe function
    return () => {
      // console.log('[auth] Cleaning up auth listener');
      // mounted = false;
      listener.subscription.unsubscribe();
    };
  }

  // const handleAuth = async () => {
  //   // await handleSession();
  //   await addListener();

  //   // Make sure to return the unsubscribe function
  //   return () => {
  //     console.log('[auth] Cleaning up auth listener');
  //     mountedRef.current = false;
  //     // listener.subscription.unsubscribe();
  //   };
  // // }


  // useEffect(() => {
  //   handleAuth();
  // }, []);


  useEffect(() => {
    let unsubscribe: undefined | (() => void);

    (async () => {
      await handleSession();
      unsubscribe = await addListener();
    })();

    return () => {
      mountedRef.current = false;
      unsubscribe?.();
    };
  }, []);



  const refreshSubscription = async () => {
    if (!user?.id) return;
    // await fetchAndSetSubscription(user.id);
    await fetchAndSetSubscription(supabaseSession!);
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

  const resetPassword = async (email: string, options?: { redirectTo?: string }) => {
    setAuthLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, options);
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

  // const signOut = async () => {
  //   setAuthLoading(true);
  //   try {
  //     console.log('1.1 - Starting sign out');

  //     // First clear local storage
  //     localStorage.removeItem(MANUAL_SESSION_KEY);
  //     localStorage.removeItem("userSession");
  //     console.log('1.2 - Local storage cleared');

  //     // Then sign out from Supabase
  //     const { error } = await supabase.auth.signOut();
  //     console.log('1.3 - Supabase signOut completed, error:', error);

  //     if (error) {
  //       console.error('[auth] Sign out error:', error);
  //     }

  //     // Manually clear all state
  //     clearAll();
  //     console.log('1.4 - State cleared');
  //     setAuthLoading(false);
  //     console.log('1.5 - Sign out completed');
  //   } catch (error) {
  //     console.error('[auth] Sign out exception:', error);
  //     setAuthLoading(false);
  //   }
  // };
  const signOut = async () => {
    setAuthLoading(true);
    isManualSignOut.current = true; // Set flag to prevent listener interference

    try {
      console.log('1.1 - Starting manual sign out');

      // First clear local storage
      localStorage.removeItem(MANUAL_SESSION_KEY);
      localStorage.removeItem("userSession");
      console.log('1.2 - Local storage cleared');
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      console.log('1.3 - Supabase signOut completed, error:', error);

      if (error) {
        console.error('[auth] Sign out error:', error);
      }

      // Manually clear all state
      clearAll();
      console.log('1.4 - State cleared');
      setAuthLoading(false);
      console.log('1.5 - Sign out completed');
    } catch (error) {
      console.error('[auth] Sign out exception:', error);
      setAuthLoading(false);
    } finally {
      isManualSignOut.current = false; // Reset flag
    }
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
    resetPassword,
    signInWithGoogle,
    signOut,
  }), [
    user,
    supabaseSession,
    subscription,
    authLoading,
    subscriptionLoading,
    refreshSubscription,
    resetPassword,
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

