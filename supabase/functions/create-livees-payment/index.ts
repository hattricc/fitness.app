import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// Estos valores te los da Livees
const LIVEES_TOKEN_COMERCIO = Deno.env.get("LIVEES_TOKEN_COMERCIO")!; // "_"
const LIVEES_LLAVE_RECURSO = Deno.env.get("LIVEES_LLAVE_RECURSO")!;   // "__"

// postURL de éxito (tu página de "pago exitoso")
const LIVEES_POST_URL = Deno.env.get("LIVEES_POST_URL")!;
// Ej: https://tu-sitio.netlify.app/pago-exitoso


const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // en dev ok. En prod puedes restringir a tu dominio.
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
    // ✅ Preflight must be handled BEFORE any method checks
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }


    return new Response(JSON.stringify(responsePayload), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: { headers: { ...corsHeaders, Authorization: req.headers.get("Authorization")! } },
        });

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return new Response("Unauthorized", { ...corsHeaders, status: 401 });
        }

        const body = await req.json();
        const { product_id, billing_info, invoice_info } = body as {
            product_id: string;
            billing_info?: Record<string, unknown>;
            invoice_info?: Record<string, unknown>;
        };

        if (!product_id) {
            return new Response("product_id is required", { ...corsHeaders, status: 400 });
        }

        const { data: product, error: productError } = await supabase
            .from("products")
            .select("*")
            .eq("id", product_id)
            .single();

        if (productError || !product) {
            return new Response("Product not found", { ...corsHeaders, status: 404 });
        }

        // Generar invno único (puedes usar otro formato)
        const invno = `ORD-${crypto.randomUUID()}`;

        // Crear registro de pago pendiente
        const { data: payment, error: paymentError } = await supabase
            .from("payments")
            .insert({
                user_id: user.id,
                product_id: product.id,
                provider: "livees",
                invno,
                status: "pending",
                amount_cents: product.price_cents,
                currency: product.currency,
                billing_info: billing_info ?? {},
                invoice_info: invoice_info ?? {},
                raw_request: {
                    postURL: LIVEES_POST_URL,
                },
            })
            .select("*")
            .single();

        if (paymentError || !payment) {
            console.error(paymentError);
            return new Response("Error creating payment: " + paymentError.message, { ...corsHeaders, status: 500 });
        }

        // Devolvemos todo lo necesario para armar el <form> en el frontend
        const responsePayload = {
            livees: {
                token_comercio: LIVEES_TOKEN_COMERCIO,
                llave_recurso: LIVEES_LLAVE_RECURSO,
                postURL: LIVEES_POST_URL,
            },
            payment: {
                id: payment.id,
                invno,
                amount: product.price_cents / 100,
                currency: product.currency, // 'BOB' o 'USD' según tu config
            },
        };

        return new Response(JSON.stringify(responsePayload), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error(err);
        return new Response("Internal server error " + err.message, {
            status: 500,
            headers: corsHeaders,
        });
    }
});
