import { createClient } from '@supabase/supabase-js';
import { Subscription } from './userSession';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
  },
});


export async function getUserWithSubscription(userId: string): Promise<Subscription | null> {
  try {
    if (!userId) {
      console.error("[sub] No userId provided");
      return null;
    }

    // Add a small delay to prevent race conditions with auth state changes
    await new Promise(resolve => setTimeout(resolve, 100));

    const { data: s } = await supabase.auth.getSession();
    console.log("[sub] hasSession?", !!s.session);
    console.log("[sub] session.user.id", s.session?.user?.id);
    console.log("[sub] param userId", userId);


    const queryPromise = supabase
      .from("payments")
      .select("status, user_id, created_at")
      .eq("user_id", userId)
      .eq("status", "paid")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Timeout para detectar “promise colgada”
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout after 3s in payments query")), 3000)
    );

    const result = (await Promise.race([queryPromise, timeoutPromise])) as any;

    console.timeEnd("[sub] query");
    console.log("[sub] result", result);

    const { data, error } = result;

    if (error) {
      console.error("[sub] supabase error", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return null;
    }

    console.log("[sub] subscription data:", data);
    return data ?? null;
  } catch (e) {
    console.error("[sub] catch", e);
    return null;
  } finally {
    console.log("[sub] finally reached");
  }
}