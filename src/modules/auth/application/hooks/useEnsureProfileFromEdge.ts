// src/modules/auth/hooks/useEnsureProfileFromEdge.ts
import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";

type EnsureProfileResult = {
    profile: {
        id: string;
        full_name: string;
        avatar_url: string;
        role: string;
    };
    created?: boolean;
    updated?: boolean;
    raceRecovered?: boolean;
};

export function useEnsureProfileFromEdge() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const ensureProfile = useCallback(async (): Promise<EnsureProfileResult | null> => {
        setLoading(true);
        setError(null);

        try {
            // 1) Verifica sesión/token disponible
            const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
            if (sessionErr) throw sessionErr;

            const token = sessionData.session?.access_token;
            if (!token) {
                setError("No hay sesión activa.");
                return null;
            }

            // 2) Llamar Edge Function (estilo GetAccessFromEdge)
            const { data, error: fnError } = await supabase.functions.invoke("ensure-profile", {
                body: {}, // no hace falta enviar nada
                // Si tu proyecto NO adjunta el JWT automáticamente, descomenta esto:
                // headers: { Authorization: `Bearer ${token}` },
            });

            if (fnError) {
                const msg =
                    (fnError as any)?.context?.body?.error ||
                    (fnError as any)?.message ||
                    "Error llamando ensure-profile";
                setError(msg);
                return null;
            }

            return data as EnsureProfileResult;
        } catch (e: any) {
            setError(e?.message ?? String(e));
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { ensureProfile, loading, error };
}
