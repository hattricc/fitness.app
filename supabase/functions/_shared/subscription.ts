export type SubscriptionStatus = "active" | "expiring_soon" | "expired";

export type SubscriptionLike = {
    end_date: string | null;
};

const EXPIRING_SOON_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export function computeSubscriptionStatus(
    sub: SubscriptionLike,
    now: Date,
): SubscriptionStatus {
    if (!sub.end_date) return "active";

    const diffMs = new Date(sub.end_date).getTime() - now.getTime();

    if (diffMs < 0) return "expired";
    if (diffMs <= EXPIRING_SOON_WINDOW_MS) return "expiring_soon";
    return "active";
}

export type ProductLike = {
    billing_interval: string | null;
};

// billing_interval real de products: 'monthly' | 'one_time' (ver claude/db/04_seed_plans.sql).
// Cualquier otro valor se trata como sin vencimiento, igual que 'one_time'.
export function nextPeriodEnd(product: ProductLike, from: Date): Date | null {
    if (product.billing_interval === "monthly") {
        const next = new Date(from);
        next.setUTCMonth(next.getUTCMonth() + 1);
        return next;
    }
    return null;
}
