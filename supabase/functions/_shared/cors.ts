// supabase/functions/_shared/cors.ts

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