import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://localhost:5173",
    "https://luissuarezf4f.com",
    "https://www.luissuarezf4f.com"  // Added www variant
]);

export interface CorsHeaders {
    "Access-Control-Allow-Origin": string;
    "Access-Control-Allow-Headers": string;
    "Access-Control-Allow-Methods": string;
    "Vary": string;
}

export function getCorsHeaders(req: Request): CorsHeaders {
    const origin = req.headers.get("origin") ?? "";
    // const allowOrigin = allowedOrigins.has(origin) ? origin : allowedOrigins.values().next().value;
    const allowOrigin = allowedOrigins.has(origin) ? origin : "*";

    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS, GET, PUT, DELETE",
        "Vary": "Origin"
    };
}

export function handleOptionsRequest(req: Request): Response | null {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: getCorsHeaders(req) });
    }
    return null;
}

const LOG_PREFIX = "[create-livees-payment]";

function errorDetails(error: unknown): { message: string; stack?: string } {
    if (error instanceof Error) {
        return { message: error.message, stack: error.stack };
    }
    return { message: String(error) };
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
// Estos valores te los da Livees
const LIVEES_TOKEN_COMERCIO = Deno.env.get("LIVEES_TOKEN_COMERCIO")!; // "_"
const LIVEES_LLAVE_RECURSO = Deno.env.get("LIVEES_LLAVE_RECURSO")!;   // "__"
// postURL de éxito (tu página de "pago exitoso")
const LIVEES_POST_URL = Deno.env.get("LIVEES_POST_URL")!;
// Ej: https://tu-sitio.netlify.app/pago-exitoso


serve(async (req) => {
    const corsHeaders = getCorsHeaders(req);


    // ✅ Preflight must be handled BEFORE any method checks
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    if (req.method !== "POST") {
        return new Response("Method not allowed", {
            status: 405,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    try {

        // IMPORTANT: ensure `Authorization header exists
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            console.log(`${LOG_PREFIX} Missing Authorization header`);
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: { headers: { ...corsHeaders, Authorization: authHeader } },
        });

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error(`${LOG_PREFIX} Unauthorized:`, userError);
            return new Response(JSON.stringify({ error: "Unauthorized", details: userError }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }


        let body: any;
        const raw = await req.text();

        try {
            body = JSON.parse(raw);
        } catch (err) {
            console.error(`${LOG_PREFIX} Error parsing body user_id=${user.id}:`, errorDetails(err), "raw:", raw);
            return new Response(
                JSON.stringify({
                    error: "Invalid JSON body",
                    details: String(err),
                    raw, // 👈 esto te muestra exactamente lo que llegó
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }
        console.log(`${LOG_PREFIX} body received user_id=${user.id}:`, JSON.stringify(body))

        const { product_id, billing_info, invoice_info } = body as {
            product_id: string;
            billing_info?: Record<string, unknown>;
            invoice_info?: Record<string, unknown>;
        };

        if (!product_id) {
            console.error(`${LOG_PREFIX} product_id is required user_id=${user.id}`);
            return new Response(JSON.stringify({ error: "product_id is required" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const { data: product, error: productError } = await supabase
            .from("products")
            .select("*")
            .eq("id", product_id)
            .single();

        if (productError || !product) {
            console.error(`${LOG_PREFIX} Product not found product_id=${product_id} user_id=${user.id}:`, productError);
            return new Response(JSON.stringify({ error: "Product not found", details: productError }), {
                status: 404,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Generar invno único (puedes usar otro formato)
        const invno = `ORD-${crypto.randomUUID()}`;

        const raw_request = {
            provider: "livees",
            created_from: "create-livees-payment",
            invno,
            postURL: LIVEES_POST_URL,
            product: {
                id: product.id,
                name: product.name ?? null,
                price_cents: product.price_cents,
                currency: product.currency,
            },
            amount: {
                cents: product.price_cents,
                value: product.price_cents / 100,
                currency: product.currency,
            },
            billing_info: billing_info,
            invoice_info: invoice_info,
            // si en el futuro mandas items desde frontend:
            items: (body as any)?.items ?? null,
        };


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
                raw_request,
            })
            .select("*")
            .single();

        if (paymentError || !payment) {
            console.error(`${LOG_PREFIX} Error creating payment invno=${invno} user_id=${user.id} product_id=${product_id}:`, paymentError);
            return new Response(JSON.stringify({ error: "Error creating payment", details: paymentError }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        console.log(`${LOG_PREFIX} Payment created invno=${invno} payment_id=${payment.id} user_id=${user.id} product_id=${product_id}`);

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
        console.error(`${LOG_PREFIX} Unhandled error:`, errorDetails(err));
        // ✅ even unexpected errors return JSON + CORS
        return new Response(JSON.stringify({ error: "Internal server error", details: String(err) }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
