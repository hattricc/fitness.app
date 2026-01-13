import { useState, useEffect, useMemo } from 'react';
import { CircularProgress, Skeleton } from '@mui/material'; // or your preferred loading component
import { AccountCircle } from '@mui/icons-material';
import { getGoogleAvatarUrl } from '@/lib/userSession';
import { useAuth } from "@/contexts/auth/AuthProvider";

export const UserImage = () => {

    const { user, authLoading } = useAuth();

    const avatarBaseUrl = useMemo(
        () => getGoogleAvatarUrl(user),
        [user]
    );

    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [loadingImg, setLoadingImg] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        try {
            setError(false);

            if (authLoading) {
                setLoadingImg(true);
                setImgSrc(null);
                return;
            }

            if (!avatarBaseUrl) {
                setLoadingImg(false);
                setImgSrc(null);
                setError(true);
                return;
            }

            setImgSrc(avatarBaseUrl);
            setLoadingImg(false);

        } catch (error) {
            console.error('Error loading image:', error);
            setLoadingImg(false);
            setError(true);
        }
    }, [avatarBaseUrl, authLoading]);

    if (!imgSrc || error) {
        return <AccountCircle style={{ width: 40, height: 40 }} />;
    }

    if (loadingImg) {
        return <CircularProgress size={40} />;
    } 

    return (
        <img
            src={imgSrc}
            alt="Profile"
            width={40}
            height={40}
            style={{ borderRadius: "50%", objectFit: "cover" }}
            onLoad={() => setLoadingImg(false)}
            onError={() => {
                setLoadingImg(false);
                setError(true);
            }}
            referrerPolicy="no-referrer"
        />
    );
};

// Usage in your component:
// <UserImage imageUrl={getGoogleAvatarUrl(user)} />