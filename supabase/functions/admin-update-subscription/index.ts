import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { nextPeriodEnd } from "../_shared/subscription.ts";

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

type Action = "activate" | "deactivate" | "change_plan";

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

    let body: { user_id?: string; action?: Action; product_code?: string };
    try {
        body = await req.json();
    } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    const { user_id, action, product_code } = body;

    if (!user_id || !action) {
        return new Response(JSON.stringify({ error: "Missing required fields", missing: ["user_id", "action"].filter((f) => !body[f as keyof typeof body]) }), {
            status: 400,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    if (!["activate", "deactivate", "change_plan"].includes(action)) {
        return new Response(JSON.stringify({ error: "Invalid action", action }), {
            status: 400,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    if (action === "change_plan" && !product_code) {
        return new Response(JSON.stringify({ error: "product_code is required for change_plan" }), {
            status: 400,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    // Suscripción más reciente del estudiante (mismo criterio que admin-list-students).
    const { data: currentSub, error: currentSubError } = await supabaseAdmin
        .from("subscriptions")
        .select("id, product_id, status")
        .eq("user_id", user_id)
        .order("started_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (currentSubError) {
        return new Response(JSON.stringify({ error: "Error fetching current subscription", details: currentSubError }), {
            status: 500,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    if (action === "deactivate") {
        if (!currentSub) {
            return new Response(JSON.stringify({ error: "No subscription to deactivate" }), {
                status: 400,
                headers: { ...cors, "Content-Type": "application/json" },
            });
        }

        const { error: updateError } = await supabaseAdmin
            .from("subscriptions")
            .update({ status: "canceled", canceled_at: new Date().toISOString(), updated_at: new Date().toISOString() })
            .eq("id", currentSub.id);

        if (updateError) {
            return new Response(JSON.stringify({ error: "Error deactivating subscription", details: updateError }), {
                status: 500,
                headers: { ...cors, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ ok: true, status: "canceled" }), {
            status: 200,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    // activate | change_plan: ambos necesitan el producto (actual o el nuevo por code)
    // para recalcular current_period_end.
    let productId = currentSub?.product_id ?? null;

    if (action === "change_plan") {
        const { data: product, error: productError } = await supabaseAdmin
            .from("products")
            .select("id")
            .eq("code", product_code)
            .maybeSingle();

        if (productError) {
            return new Response(JSON.stringify({ error: "Error fetching product", details: productError }), {
                status: 500,
                headers: { ...cors, "Content-Type": "application/json" },
            });
        }

        if (!product) {
            return new Response(JSON.stringify({ error: "Unknown product_code", product_code }), {
                status: 400,
                headers: { ...cors, "Content-Type": "application/json" },
            });
        }

        productId = product.id;
    }

    if (!productId) {
        return new Response(JSON.stringify({ error: "Student has no plan yet; use change_plan with a product_code first" }), {
            status: 400,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    const { data: product, error: productError } = await supabaseAdmin
        .from("products")
        .select("billing_interval")
        .eq("id", productId)
        .single();

    if (productError) {
        return new Response(JSON.stringify({ error: "Error fetching product billing_interval", details: productError }), {
            status: 500,
            headers: { ...cors, "Content-Type": "application/json" },
        });
    }

    const now = new Date();
    const currentPeriodEnd = nextPeriodEnd(product, now);

    const patch = {
        product_id: productId,
        status: "active",
        current_period_start: now.toISOString(),
        current_period_end: currentPeriodEnd ? currentPeriodEnd.toISOString() : null,
        canceled_at: null,
        updated_at: now.toISOString(),
    };

    if (currentSub) {
        const { error: updateError } = await supabaseAdmin
            .from("subscriptions")
            .update(patch)
            .eq("id", currentSub.id);

        if (updateError) {
            return new Response(JSON.stringify({ error: "Error updating subscription", details: updateError }), {
                status: 500,
                headers: { ...cors, "Content-Type": "application/json" },
            });
        }
    } else {
        const { error: insertError } = await supabaseAdmin
            .from("subscriptions")
            .insert({
                user_id,
                started_at: now.toISOString(),
                metadata: {},
                ...patch,
            });

        if (insertError) {
            return new Response(JSON.stringify({ error: "Error creating subscription", details: insertError }), {
                status: 500,
                headers: { ...cors, "Content-Type": "application/json" },
            });
        }
    }

    return new Response(JSON.stringify({ ok: true, status: "active", current_period_end: patch.current_period_end }), {
        status: 200,
        headers: { ...cors, "Content-Type": "application/json" },
    });
});
