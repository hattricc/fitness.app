import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://localhost:5173",
    "https://luissuarezf4f.com",
    "https://www.luissuarezf4f.com",
]);

export function getCorsHeaders(req: Request) {
    const origin = req.headers.get("origin") ?? "";
    const allowOrigin = allowedOrigins.has(origin) ? origin : "*";

    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS, GET, PUT, DELETE",
        "Vary": "Origin",
    };
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Producto que da acceso permanente
const ACCESS_PRODUCT_ID = "e45f8d41-0132-44c5-9e05-254ca96db19a";

serve(async (req) => {
    const corsHeaders = getCorsHeaders(req);

    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    if (req.method !== "GET") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 1) Validar user usando ANON + Authorization del cliente
        const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: { headers: { Authorization: authHeader } },
        });

        const { data: userRes, error: userErr } = await authClient.auth.getUser();
        const user = userRes?.user;

        if (userErr || !user) {
            return new Response(JSON.stringify({ error: "Unauthorized", details: userErr }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 2) Consultar payments con SERVICE ROLE (sin RLS)
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        const { data: payment, error: payErr } = await supabase
            .from("payments")
            .select("id, status, product_id, paid_at, created_at")
            .eq("user_id", user.id)
            .eq("product_id", ACCESS_PRODUCT_ID)
            .eq("status", "paid")
            .order("paid_at", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (payErr) {
            return new Response(JSON.stringify({ error: "Payments query failed", details: payErr }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        console.log('payment found: ', payment);

        const hasAccess = !!payment;

        return new Response(JSON.stringify({
            hasAccess,
            productId: ACCESS_PRODUCT_ID,
            paymentId: payment?.id ?? null,
            status: payment?.status ?? null,
            lastPaidAt: payment?.paid_at ?? payment?.created_at ?? null,
            userId: user.id,
        }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: "Internal server error", details: String(err) }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
