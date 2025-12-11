import { createClient } from '@supabase/supabase-js';

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

// console.log(supabase)

// try {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email: "raidenmt96@gmail.com",
//     password: "2mnb:W66Cx!7b-5",
//   });
//   console.log(data)
//   console.log(error)
//   console.log(data.session?.access_token);
// } catch (error) {
//   console.log(error)
// }

// // Types
// export type User = {
//   id: string;
//   email?: string;
//   user_metadata?: {
//     name?: string;
//     avatar_url?: string;
//   };
// };
