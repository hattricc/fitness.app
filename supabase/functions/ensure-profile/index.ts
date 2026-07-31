import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Ajusta tus dominios
const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://localhost:5173",
    "https://luissuarezf4f.com",
    "https://www.luissuarezf4f.com",
]);

function corsHeaders(req: Request) {
    const origin = req.headers.get("origin") ?? "";
    const allowOrigin = allowedOrigins.has(origin) ? origin : "*";
    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Vary": "Origin",
    };
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

type ProfileRow = {
    id: string;
    full_name: string;
    avatar_url: string;
    phone: string;
    role: string;
    created_at?: string;
};

const clean = (v: unknown) => (v == null ? "" : String(v)).trim();

serve(async (req) => {
    const cors = corsHeaders(req);

    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: { ...cors } });
    }

    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    // 1) Validar Authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
            status: 401,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    // Cliente “user” (anon + jwt) solo para identificar usuario
    const supabaseUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
    });

    const {
        data: { user },
        error: userError,
    } = await supabaseUser.auth.getUser();

    if (userError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized", details: String(userError) }), {
            status: 401,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    // Cliente admin (service role) para upsert sin RLS
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 2) Si ya existe, devolverlo (y opcionalmente completar campos vacíos)
    const { data: existing, error: checkError } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, avatar_url, phone, role")
        .eq("id", user.id)
        .maybeSingle();

    if (checkError) {
        return new Response(JSON.stringify({ error: "Error checking profile", details: checkError }), {
            status: 500,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    // Normaliza nombre y avatar desde metadata (Google / etc.)
    const fullName =
        clean(user.user_metadata?.full_name) ||
        clean(user.user_metadata?.name) ||
        "";

    const avatarUrl = clean(user.user_metadata?.avatar_url) || "";
    const phone = clean(user.user_metadata?.phone) || "";

    // Si existe, podrías opcionalmente “completar” campos vacíos:
    if (existing) {
        const needsUpdate =
            (!existing.full_name && fullName) ||
            (!existing.avatar_url && avatarUrl) ||
            (!existing.phone && phone) ||
            !existing.role;

        if (!needsUpdate) {
            return new Response(JSON.stringify({ profile: existing, created: false }), {
                status: 200,
                headers: { ...cors, "Content-Type": "application/json" },
            });
        }

        const patch: Partial<ProfileRow> = {
            full_name: existing.full_name || fullName,
            avatar_url: existing.avatar_url || avatarUrl,
            phone: existing.phone || phone,
            role: existing.role || "user",
        };

        const { data: updated, error: updError } = await supabaseAdmin
            .from("profiles")
            .update(patch)
            .eq("id", user.id)
            .select("id, full_name, avatar_url, phone, role")
            .single();

        if (updError) {
            return new Response(JSON.stringify({ error: "Error updating profile", details: updError }), {
                status: 500,
                headers: { ...cors, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ profile: updated, created: false, updated: true }), {
            status: 200,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    // 3) Crear profile si no existe
    const profileData: ProfileRow = {
        id: user.id,
        full_name: fullName,
        avatar_url: avatarUrl,
        phone,
        role: "user",
        created_at: new Date().toISOString(),
    };

    const { data: inserted, error: insError } = await supabaseAdmin
        .from("profiles")
        .insert(profileData)
        .select("id, full_name, avatar_url, phone, role")
        .single();

    if (insError) {
        // En caso de carrera (dos llamados al mismo tiempo), intenta leer y devolver
        const { data: fallback } = await supabaseAdmin
            .from("profiles")
            .select("id, full_name, avatar_url, phone, role")
            .eq("id", user.id)
            .maybeSingle();

        if (fallback) {
            return new Response(JSON.stringify({ profile: fallback, created: false, raceRecovered: true }), {
                status: 200,
                headers: { ...cors, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ error: "Error creating profile", details: insError }), {
            status: 500,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ profile: inserted, created: true }), {
        status: 200,
        headers: { ...cors, "Content-Type": "application/json" },
    });
});
