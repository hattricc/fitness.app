// @deno-types="https://deno.land/x/types/deno.d.ts"
// @deno-types="https://esm.sh/v135/@supabase/supabase-js@2.39.0/deno/supabase-js.d.ts"
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

type StatusCode = number;

type ResponseData = Record<string, unknown> | unknown[] | string | number | boolean | null;
type ErrorDetails = Record<string, unknown> | string | null;

interface StatusMessages {
    [key: number]: {
        status: number;
        message: string;
    };
}

class ResponseBuilder {
    private static statusMessages: StatusMessages = {
        200: { status: 200, message: 'OK' },
        201: { status: 201, message: 'Created' },
        204: { status: 204, message: 'No Content' },
        400: { status: 400, message: 'Bad Request' },
        401: { status: 401, message: 'Unauthorized' },
        403: { status: 403, message: 'Forbidden' },
        404: { status: 404, message: 'Not Found' },
        405: { status: 405, message: 'Method Not Allowed' },
        409: { status: 409, message: 'Conflict' },
        422: { status: 422, message: 'Unprocessable Entity' },
        429: { status: 429, message: 'Too Many Requests' },
        500: { status: 500, message: 'Internal Server Error' },
        502: { status: 502, message: 'Bad Gateway' },
        503: { status: 503, message: 'Service Unavailable' },
    };

    static createResponse(
        statusCode: StatusCode,
        corsHeaders: CorsHeaders,
        data: any = null,
    ): Response {
        const statusInfo = this.statusMessages[statusCode] || { status: statusCode, message: 'Unknown Status' };

        // For 204 No Content, return response without a body
        if (statusCode === 204) {
            return new Response(null, {
                status: statusCode,
                headers: {
                    ...corsHeaders
                }
            });
        }

        const responseBody = {
            status: statusInfo.status,
            message: statusInfo.message,
            ...(data && { data })
        };
        return new Response(JSON.stringify(responseBody), {
            status: statusCode,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
    }

    static error(
        statusCode: StatusCode,
        corsHeaders: CorsHeaders,
        details: ErrorDetails = null,
    ): Response {
        const responseBody: Record<string, unknown> = {
            status: statusCode,
            error: this.statusMessages[statusCode].message,
        };

        if (details) {
            responseBody.details = details;
        }

        return new Response(JSON.stringify(responseBody), {
            status: statusCode,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
    }
}


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
        return ResponseBuilder.createResponse(204, getCorsHeaders(req));
    }
    return null;
}

declare const Deno: any; // Temporary workaround for Deno types

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const LIVEES_LLAVE_RECURSO = Deno.env.get("LIVEES_LLAVE_RECURSO")!;
const LIVEES_WS_BASE = "https://www.livees.net/Checkout/WS";

function handleAuthorization(req: Request, corsHeaders: CorsHeaders): Response | null {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        console.log("Missing Authorization header");
        return ResponseBuilder.error(401, corsHeaders, { error: "Missing Authorization header" });
    }
    return null;
}

async function parseRequestBody(req: Request, corsHeaders: CorsHeaders): Promise<{ body: any; error: Response | null }> {
    try {
        const raw = await req.text();
        return { body: JSON.parse(raw), error: null };
    } catch (err) {
        console.log('Error parsing body:', err);
        return {
            body: null,
            error: ResponseBuilder.error(400, corsHeaders, {
                details: String(err),
                raw: await req.text()
            })
        };
    }
}

function validateRequiredFields(body: any, fields: string[], corsHeaders: CorsHeaders): Response | null {
    const missingFields = fields.filter(field => !body[field]);
    if (missingFields.length > 0) {
        return ResponseBuilder.error(400, corsHeaders, {
            error: "Missing required fields",
            missing: missingFields
        });
    }
    return null;
}

async function findPayment(supabase: any, invno: string, corsHeaders: CorsHeaders): Promise<{ payment: any; error: Response | null }> {
    const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .select("*")
        .eq("invno", invno)
        .single();

    if (paymentError || !payment) {
        return {
            payment: null,
            error: ResponseBuilder.error(404, corsHeaders, {
                error: "Payment not found",
                invno
            })
        };
    }
    return { payment, error: null };
}

async function checkLiveesPayment(orderId: string, req: Request): Promise<{ data: any; error: Response | null }> {
    try {
        const formBody = {
            order_id: orderId,
            "__": LIVEES_LLAVE_RECURSO,
        };

        const res = await fetch(`${LIVEES_WS_BASE}/ConsultaOrden`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formBody),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Error Livees WS:", res.status, text);
            return {
                data: null,
                error: ResponseBuilder.error(502, getCorsHeaders(req), {
                    details: text
                })
            };
        }

        return { data: await res.json(), error: null };
    } catch (error) {
        console.error("Error in checkLiveesPayment:", error);
        return {
            data: null,
            error: ResponseBuilder.error(500, getCorsHeaders(req), {
                details: String(error)
            })
        };
    }
}

async function updatePaymentStatus(
    supabase: any,
    paymentId: string,
    orderId: string,
    liveesData: any,
    success: boolean
): Promise<{ error: any }> {
    const newStatus = success ? "paid" : "failed";
    const updateData: Record<string, unknown> = {
        status: newStatus,
        provider_payment_id: orderId,
        raw_response: liveesData,
        updated_at: new Date().toISOString(),
    };

    if (newStatus === "paid") {
        updateData["paid_at"] = new Date().toISOString();
    }

    // Log payment event
    await supabase.from("payment_events").insert({
        payment_id: paymentId,
        event_type: "livees.consulta_orden",
        payload: {
            request: { order_id: orderId },
            response: liveesData
        },
    });

    // Update payment status
    const { error } = await supabase
        .from("payments")
        .update(updateData)
        .eq("id", paymentId);

    return { error };
}

// Main handler function
async function handlePaymentConfirmation(req: Request, corsHeaders: CorsHeaders): Promise<Response> {
    // 1. Authorization
    const authError = handleAuthorization(req, corsHeaders);
    if (authError) return authError;

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { ...corsHeaders, Authorization: req.headers.get("Authorization")! } },
    });

    // 2. Parse request body
    const { body, error: parseError } = await parseRequestBody(req, corsHeaders);
    if (parseError) return parseError;

    // 3. Validate required fields
    const validationError = validateRequiredFields(body, ["invno", "order_id"], corsHeaders);
    if (validationError) return validationError;
    const { invno, order_id } = body;

    // 4. Find payment
    const { payment, error: paymentError } = await findPayment(supabase, invno, corsHeaders);
    if (paymentError) return paymentError;

    // 5. Check payment with Livees
    const { data: liveesData, error: liveesError } = await checkLiveesPayment(order_id, req);
    if (liveesError) return liveesError;

    // 6. Process payment status
    const success = liveesData?.success === true ||
        liveesData?.success === "true" ||
        liveesData?.message?.toString().toLowerCase().includes("existente");

    // 7. Update payment status
    const { error: updateError } = await updatePaymentStatus(
        supabase,
        payment.id,
        order_id,
        liveesData,
        success
    );

    if (updateError) {
        console.error("Error updating payment:", updateError);
        return ResponseBuilder.error(500, corsHeaders, {
            error: "Failed to update payment",
            details: updateError
        });
    }

    return ResponseBuilder.createResponse(200, corsHeaders, {
        status: success ? "paid" : "failed",
        payment_id: payment.id
    });
}

// Main server handler
serve(async (req: Request) => {
    const corsHeaders = getCorsHeaders(req);

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        return ResponseBuilder.createResponse(204, corsHeaders);
    }

    // Only allow POST requests
    if (req.method !== "POST") {
        return ResponseBuilder.createResponse(405, corsHeaders);
    }

    try {
        return await handlePaymentConfirmation(req, corsHeaders);
    } catch (error) {
        console.error("Unhandled error:", error);
        return ResponseBuilder.error(500, corsHeaders, {
            error: "Internal server error",
            details: String(error)
        });
    }
});