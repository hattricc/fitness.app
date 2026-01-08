import { useState, useEffect } from 'react';
import { Skeleton } from '@mui/material'; // or your preferred loading component
import { UserSession } from '@/lib/userSession';
import { AccountCircle } from '@mui/icons-material';

export const UserImage = ({ user, imageUrl }: { user: UserSession | null, imageUrl: string | null }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!imageUrl) {
            setIsLoading(false);
            setError(true);
            return;
        }

        let isMounted = true;
        const img = new Image();
        let retryTimer: NodeJS.Timeout;
        let retryCount = 0;
        const maxRetries = 2;

        const loadImage = (url: string) => {
            img.onload = () => {
                if (!isMounted) return;
                setIsLoading(false);
                setError(false);
                setImgSrc(url);
            };

            img.onerror = () => {
                if (retryCount < maxRetries) {
                    retryCount++;
                    retryTimer = setTimeout(() => {
                        const separator = url.includes('?') ? '&' : '?';
                        loadImage(`${url}${separator}t=${Date.now()}`);
                    }, 1000 * Math.pow(2, retryCount));
                } else if (isMounted) {
                    setIsLoading(false);
                    setError(true);
                }
            };

            img.src = url;
        };

        loadImage(imageUrl);

        return () => {
            isMounted = false;
            img.onload = null;
            img.onerror = null;
            clearTimeout(retryTimer);
        };
    }, [imageUrl]);

    if (isLoading) {
        return <Skeleton variant="circular" width={40} height={40} />;
    }

    console.log('imgSrc', imgSrc)
    console.log('error', error)

    return (
        <>
            {imgSrc && !error ? (
                <img
                    src={imgSrc}
                    alt="Profile"
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }}
                    loading="lazy"
                />
            ) : (
                <AccountCircle style={{ width: 40, height: 40 }} />
            )}
        </>
    );
};

// Usage in your component:
// <UserImage imageUrl={getGoogleAvatarUrl(user)} />