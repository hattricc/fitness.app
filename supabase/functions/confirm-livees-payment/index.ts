// @deno-types="https://deno.land/x/types/deno.d.ts"
// @deno-types="https://esm.sh/v135/@supabase/supabase-js@2.39.0/deno/supabase-js.d.ts"
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

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

declare const Deno: any; // Temporary workaround for Deno types

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const LIVEES_LLAVE_RECURSO = Deno.env.get("LIVEES_LLAVE_RECURSO")!;
const LIVEES_WS_BASE = "https://www.livees.net/Checkout/WS";

serve(async (req: Request) => {
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
            console.log("Missing Authorization header");
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: { headers: { ...corsHeaders, Authorization: authHeader } },
        });
        
        // const {
        //     data: { user },
        //     error: userError,
        // } = await supabase.auth.getUser();

        // console.log('user', user);
        // console.log('userError', userError);

        // if (userError || !user) {
        //     console.log("Unauthorized", userError);
        //     return new Response(JSON.stringify({ error: "Unauthorized", details: userError }), {
        //         status: 401,
        //         headers: { ...corsHeaders, "Content-Type": "application/json" },
        //     });
        // }

        let body: any;
        const raw = await req.text();
        
        try {
            body = JSON.parse(raw);
        } catch (err) {
            console.log('error parsing body: ', err)
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

        const { invno, order_id } = body as {
            invno: string;
            order_id: string;
        };

        if (!invno || !order_id) {
            return new Response("invno and order_id are required", {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const { data: payment, error: paymentError } = await supabase
            .from("payments")
            .select("*")
            .eq("invno", invno)
            .single();

        if (paymentError || !payment) {
            return new Response("Payment not found", {
                status: 404,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const formBody = new URLSearchParams({
            order_id,
            "__": LIVEES_LLAVE_RECURSO,
        });

        const res = await fetch(`${LIVEES_WS_BASE}/ConsultaOrden`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody.toString(),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Error Livees WS:", res.status, text);
            return new Response("Error contacting Livees", {
                status: 502,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }
        
        const data = await res.json();

        const success =
            data.success === true ||
            data.success === "true" ||
            data.message?.toString().toLowerCase().includes("existente");

        const newStatus = success ? "paid" : "failed";

        console.log('body to livees: ', body)
        console.log('response from livees: ', data)
        console.log('newStatus: ', newStatus)
        
        await supabase.from("payment_events").insert({
            payment_id: payment.id,
            event_type: "livees.consulta_orden",
            payload: { request: { invno, order_id }, response: data },
        });

        const updateData: Record<string, unknown> = {
            status: newStatus,
            provider_payment_id: order_id,
            raw_response: data,
            updated_at: new Date().toISOString(),
        };
        if (newStatus === "paid") {
            updateData["paid_at"] = new Date().toISOString();
        }
        console.log('asi se ve nuevo objeto ', updateData)

        const { error: updateError } = await supabase
            .from("payments")
            .update(updateData)
            .eq("id", payment.id);
        console.log('buscando pago actualizado', payment.id);

        if (updateError) {
            console.error(updateError);
            return new Response("Error updating payment", {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(
            JSON.stringify({ status: newStatus, payment_id: payment.id }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (err) {
        console.error(err);
        return new Response("Internal server error", {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
