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


const AVATAR_CACHE_KEY = 'user_avatar_url';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
export const getGoogleAvatarUrl = (user: UserSession | null): string | null => {
    if (typeof window === 'undefined') return null;
    
    if (!user?.identities) return null;
    try {
        // Try to get cached avatar
        const cachedAvatar = localStorage.getItem(AVATAR_CACHE_KEY);
        if (cachedAvatar) {
            const { url, timestamp } = JSON.parse(cachedAvatar);
            // Return cached URL if it's still valid
            if (Date.now() - timestamp < CACHE_TTL) {
                return url;
            }
        }
        // Get fresh URL if no valid cache
        const googleIdentity = user.identities.find(x => x.provider === 'google');
        const pictureUrl = googleIdentity?.identity_data?.picture;
        
        if (!pictureUrl) return null;
        // Add cache-busting parameter
        const separator = pictureUrl.includes('?') ? '&' : '?';
        const finalUrl = `${pictureUrl}${separator}t=${Date.now()}`;
        // Cache the new URL
        localStorage.setItem(
            AVATAR_CACHE_KEY,
            JSON.stringify({
                url: finalUrl,
                timestamp: Date.now()
            })
        );
        console.log(finalUrl);
        return finalUrl;
    } catch (error) {
        console.error('Error handling avatar URL:', error);
        return null;
    }
};
// Optional: Add a function to clear the avatar cache
export const clearAvatarCache = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(AVATAR_CACHE_KEY);
    }
};

// export const getGoogleAvatarUrl = (user: UserSession | null) => {
//     if (user && user.identities) {
//         const googleIdentity = user.identities.find(x => x.provider === 'google');
//         const sep = googleIdentity?.identity_data?.picture.includes("?") ? "&" : "?";
//         return `${googleIdentity?.identity_data?.picture}${sep}t=${Date.now()}`;
//     }

//     return null;
// };
