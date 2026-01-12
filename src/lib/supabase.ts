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
export async function getUserWithSubscription(userId: string): Promise<Subscription | null> {
  try {
    if (!userId) {
      console.error('No userId provided');
      return null;
    }

    const { data: subscription, error } = await supabase
      .from('payments')
      .select('status')
      .eq('user_id', userId)
      .eq('product_id', 'e45f8d41-0132-44c5-9e05-254ca96db19a')
      .eq('status', 'paid')  // Filter for paid status
      .order('created_at', { ascending: false })  // Get most recent first
      .limit(1)  // Only return one record
      .maybeSingle();  // Returns null if no rows, or the single row if found
    console.log('looking subscription for user', userId);

    if (error) {
      if (error.code === 'PGRST116') {
        console.error('No subscription found for user');
        return null;
      }
      throw error;
    }
    return subscription as Subscription;
  } catch (error) {
    console.error('Error in getUserWithSubscription:', error);
    return null;
  }
}