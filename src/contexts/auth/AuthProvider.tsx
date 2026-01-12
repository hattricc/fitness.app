import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { getUserWithSubscription, supabase } from '@/lib/supabase';
import { mapUserSession, UserSession, Subscription } from '@/lib/userSession';

type AuthContextType = {
  user: UserSession | null;
  subscription: Subscription | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
  setSession: (user: UserSession | null) => void;
};

export const AuthProvider = ({ children, setSession }: AuthProviderProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserSession | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);


  const getSubscription = async (currentUser: UserSession | null) => {
    const savedUser = localStorage.getItem('userSession');
    if (!savedUser) return;

    try {
      const user = JSON.parse(savedUser);
      if (!user?.id) return null;

      console.log('trying to get subscription', user.id);
      const subscription = await getUserWithSubscription(user.id);

      setSubscription(subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to parse user session:', error);
      localStorage.removeItem('userSession');
    }
  };


  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('event', event)
        console.log('session', session)

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSubscription(null);
          setSession(null);
          setLoading(false);
          return;
        }

        if (event === 'SIGNED_IN' && session?.user) {
          const currentUser = session?.user;
          const userData = mapUserSession(currentUser, null);
          setUser(userData);
          // await getSubscription(userData);
          setSession(userData);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  useEffect(() => {
    setTimeout(async () => {
      console.log('getSubscription')
      await getSubscription(user);
    }, 1000);
  }, [user]);


  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setLoading(false);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // redirectTo: `${window.location.origin}/dashboard`,
        // redirectTo: `http://localhost:3000/auth/callback`,
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    subscription,
  };

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

