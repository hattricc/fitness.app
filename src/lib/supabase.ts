import { createClient, SupabaseClient } from '@supabase/supabase-js';
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
  },
});

// Get user subscription
// export async function getUserWithSubscription(userId: string): Promise<Subscription | null> {
//   try {
//     if (!userId) {
//       console.error('No userId provided');
//       return null;
//     }

//     console.log('vamos a buscar suscripcion para el usuario', userId);

//     const { data: subscription, error } = await supabase
//       .from('payments')
//       .select('status')
//       .eq('user_id', userId)
//       // .eq('product_id', 'e45f8d41-0132-44c5-9e05-254ca96db19a')
//       .eq('status', 'paid')  // Filter for paid status
//       // .order('created_at', { ascending: false })  // Get most recent first
//       .limit(1)  // Only return one record
//       .maybeSingle();  // Returns null if no rows, or the single row if found

//     console.log('looking subscription for user', userId);
//     console.log('looking subscription for user', userId);

//     if (error) {
//       if (error.code === 'PGRST116') {
//         console.error('No subscription found for user');
//         return null;
//       }
//       throw error;
//     }
//     return subscription as Subscription;
//   } catch (error) {
//     console.error('Error in getUserWithSubscription:', error);
//     return null;
//   }
// }

export async function getUserWithSubscription(userId: string) {
  console.log("[sub] start", { userId });

  try {
    if (!userId) {
      console.error("[sub] No userId provided");
      return null;
    }

    console.time("[sub] query");

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
      setTimeout(() => reject(new Error("Timeout after 5s in payments query")), 5000)
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

    console.log("[sub] data", data);
    return data ?? null;
  } catch (e) {
    console.error("[sub] catch", e);
    return null;
  } finally {
    console.log("[sub] finally reached");
  }
}