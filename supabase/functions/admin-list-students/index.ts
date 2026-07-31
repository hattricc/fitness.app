import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { computeSubscriptionStatus } from "../_shared/subscription.ts";

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
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Vary": "Origin",
    };
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Estados de subscription_status que cuentan como "vigente" para efectos de
// calcular expiring_soon/expired por fecha. El resto (canceled, cancelled,
// past_due, incomplete) se muestra directamente como vencida.
const LIFECYCLE_ACTIVE_STATUSES = new Set(["active", "pending"]);

serve(async (req) => {
    const cors = corsHeaders(req);

    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: { ...cors } });
    }

    if (req.method !== "GET") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
            status: 401,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

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

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Solo admins pueden listar estudiantes
    const { data: callerProfile, error: callerError } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

    if (callerError) {
        return new Response(JSON.stringify({ error: "Error checking caller role", details: callerError }), {
            status: 500,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    if (callerProfile?.role !== "admin") {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    const { data: profiles, error: profilesError } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, phone")
        .order("full_name", { ascending: true });

    if (profilesError) {
        return new Response(JSON.stringify({ error: "Error fetching students", details: profilesError }), {
            status: 500,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    // El email vive en auth.users, no en profiles — no está expuesto vía PostgREST,
    // hay que pedirlo con el Admin API (service role).
    const { data: usersPage, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
    });

    if (usersError) {
        return new Response(JSON.stringify({ error: "Error fetching user emails", details: usersError }), {
            status: 500,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    const emailByUserId = new Map<string, string | null>();
    for (const u of usersPage.users) {
        emailByUserId.set(u.id, u.email ?? null);
    }

    // subscriptions no tiene "plan"/"end_date" propios: el plan vive en
    // products (via product_id) y el vencimiento es current_period_end.
    // Ver claude/db/01_verify_existing_schema.sql y docs/changelog-interno.md.
    const { data: subscriptions, error: subscriptionsError } = await supabaseAdmin
        .from("subscriptions")
        .select("user_id, status, started_at, current_period_end, products(code, name)")
        .order("started_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

    if (subscriptionsError) {
        return new Response(JSON.stringify({ error: "Error fetching subscriptions", details: subscriptionsError }), {
            status: 500,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    // La primera fila de cada user_id es la más reciente (ya viene ordenado).
    const latestSubscriptionByUser = new Map<string, any>();
    for (const sub of subscriptions ?? []) {
        if (!latestSubscriptionByUser.has(sub.user_id)) {
            latestSubscriptionByUser.set(sub.user_id, sub);
        }
    }

    const now = new Date();

    const students = (profiles ?? []).map((profile: any) => {
        const sub = latestSubscriptionByUser.get(profile.id);

        if (!sub) {
            return {
                id: profile.id,
                full_name: profile.full_name,
                phone: profile.phone,
                email: emailByUserId.get(profile.id) ?? null,
                subscription: null,
            };
        }

        const product = Array.isArray(sub.products) ? sub.products[0] : sub.products;

        const computedStatus = LIFECYCLE_ACTIVE_STATUSES.has(sub.status)
            ? computeSubscriptionStatus({ end_date: sub.current_period_end }, now)
            : "expired";

        return {
            id: profile.id,
            full_name: profile.full_name,
            phone: profile.phone,
            email: emailByUserId.get(profile.id) ?? null,
            subscription: {
                plan: product?.name ?? product?.code ?? null,
                planCode: product?.code ?? null,
                status: sub.status,
                end_date: sub.current_period_end,
                computedStatus,
            },
        };
    });

    return new Response(JSON.stringify({ students }), {
        status: 200,
        headers: { ...cors, "Content-Type": "application/json" },
    });
});
