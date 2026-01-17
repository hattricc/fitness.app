import { supabase } from '@/lib/supabase';

/**
 * Verifica un JWT de Supabase y devuelve el user si es válido.
 * Nota: esto no requiere service role. Es para testing/cliente.
 */
export async function verifyToken(accessToken: string) {
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error) throw error;
    return data.user;
}
