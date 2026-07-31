import { describe, expect, it } from "vitest";
import { computeSubscriptionStatus, nextPeriodEnd } from "./subscription";

describe("computeSubscriptionStatus", () => {
    const now = new Date("2026-07-30T00:00:00.000Z");

    it("returns active for an end_date far in the future", () => {
        const status = computeSubscriptionStatus(
            { end_date: "2026-12-01T00:00:00.000Z" },
            now,
        );
        expect(status).toBe("active");
    });

    it("returns expiring_soon for an end_date within 7 days", () => {
        const status = computeSubscriptionStatus(
            { end_date: "2026-08-03T00:00:00.000Z" },
            now,
        );
        expect(status).toBe("expiring_soon");
    });

    it("returns expired for an end_date in the past", () => {
        const status = computeSubscriptionStatus(
            { end_date: "2026-07-01T00:00:00.000Z" },
            now,
        );
        expect(status).toBe("expired");
    });

    it("returns active when there is no end_date", () => {
        const status = computeSubscriptionStatus({ end_date: null }, now);
        expect(status).toBe("active");
    });
});

describe("nextPeriodEnd", () => {
    const from = new Date("2026-01-15T00:00:00.000Z");

    it("adds 1 month for billing_interval monthly", () => {
        const result = nextPeriodEnd({ billing_interval: "monthly" }, from);
        expect(result?.toISOString()).toBe("2026-02-15T00:00:00.000Z");
    });

    it("returns null for billing_interval one_time (vitalicio no vence)", () => {
        const result = nextPeriodEnd({ billing_interval: "one_time" }, from);
        expect(result).toBeNull();
    });
});
