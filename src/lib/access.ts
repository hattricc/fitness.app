import type { Session } from "@supabase/supabase-js";
import type { PaymentAccess } from "@/lib/userSession";

export async function getAccessFromEdge(session: Session): Promise<PaymentAccess> {
    const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-access`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        }
    );

    const body = await res.json();

    if (!res.ok) {
        throw new Error(body?.error || "Failed to fetch access");
    }

    return {
        hasAccess: !!body.hasAccess,
        productId: body.productId,
        lastPaidAt: body.lastPaidAt,
        paymentId: body.paymentId,
        status: body.status,
    };
}
