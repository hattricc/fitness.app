import type { Session } from "@supabase/supabase-js";

export type StudentSubscription = {
    plan: string;
    planCode: string | null;
    status: string;
    end_date: string | null;
    computedStatus: "active" | "expiring_soon" | "expired";
};

export type Student = {
    id: string;
    full_name: string;
    phone: string | null;
    email: string | null;
    subscription: StudentSubscription | null;
};

export async function getStudentsFromEdge(session: Session): Promise<Student[]> {
    const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-list-students`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        }
    );

    const body = await res.json();

    if (!res.ok) {
        throw new Error(body?.error || "Failed to fetch students");
    }

    return body.students as Student[];
}

export type UpdateSubscriptionAction = "activate" | "deactivate" | "change_plan";

export async function updateStudentSubscription(
    session: Session,
    params: { user_id: string; action: UpdateSubscriptionAction; product_code?: string }
): Promise<void> {
    const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-update-subscription`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        }
    );

    const body = await res.json();

    if (!res.ok) {
        throw new Error(body?.error || "Failed to update subscription");
    }
}
