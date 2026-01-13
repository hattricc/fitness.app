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

  const applySession = async (session: Session | null) => {
    setSupabaseSession(session);

    if (!session?.user) {
      clearAll();
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

    console.log('1')

    // 1) sesión inicial
    supabase.auth.getSession().then(async ({ data, error }) => {
      console.log('data', data)
      console.log('error', error)
      
      if (!mounted) return;
      console.log('2')
      if (error) console.error("getSession error:", error);
      await applySession(data.session ?? null);
    });

    // 2) listener único
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // Nota: no llames getSession aquí; usa `session` directo
      await applySession(session ?? null);
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

