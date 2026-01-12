import { UserIdentity } from "@supabase/supabase-js";

export type Subscription = {
    id: string;
    userId: string;
    status: 'active' | 'canceled' | 'inactive' | 'paid';
    currentPeriodEnd: string; // ISO date string
    planId: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
};
export type UserSession = {
    email: string | undefined;
    id: string | undefined;
    role: string | undefined;
    last_sign_in_at: string | undefined;
    user_metadata?: {
        role?: string;
    };
    identities: UserIdentity[];
    subscription?: {
        isActive: boolean;
        data?: Subscription;
    };
};

export const mapUserSession = (
    authUser: any,
    subscriptionData?: Subscription | null
): UserSession | null => {
    if (!authUser) return null;

    const isSubscriptionActive = subscriptionData
        ? ['active', 'paid'].includes(subscriptionData.status) &&
        new Date(subscriptionData.currentPeriodEnd) > new Date()
        : false;
    
    return {
        email: authUser.email || undefined,
        id: authUser.id || undefined,
        role: authUser.user_metadata?.role,
        last_sign_in_at: authUser.last_sign_in_at || undefined,
        identities: authUser.identities || [],
        subscription: {
            isActive: isSubscriptionActive,
            ...(subscriptionData && { data: subscriptionData })
        }
    };
};

export const getUserSession = (): UserSession | null => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
};

export const setUserSession = (user: UserSession | null) => {
    if (typeof window === 'undefined') return;

    if (!user) {
        localStorage.removeItem('user');
        return;
    }

    const userData: UserSession = {
        email: user.email || undefined,
        id: user.id || undefined,
        role: user.role,
        last_sign_in_at: user.last_sign_in_at || undefined,
        identities: user.identities,
    };

    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
};

export const clearUserSession = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user');
};

export const updateUserSession = (updates: Partial<UserSession>) => {
    if (typeof window === 'undefined') return null;

    const currentSession = getUserSession();
    if (!currentSession) return null;

    const updatedSession = { ...currentSession, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedSession));
    return updatedSession;
};

export const getGoogleAvatarUrl = (user: UserSession | null) => {
    if (user && user.identities) {
        const googleIdentity = user.identities.find(x => x.provider === 'google');
        return googleIdentity?.identity_data?.picture;
    }

    return null;
};