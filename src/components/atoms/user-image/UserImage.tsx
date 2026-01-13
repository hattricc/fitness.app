import { useState, useEffect, useMemo } from 'react';
import { Skeleton } from '@mui/material'; // or your preferred loading component
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

            // cache-bust opcional para evitar imágenes viejas
            const sep = avatarBaseUrl.includes("?") ? "&" : "?";
            setImgSrc(`${avatarBaseUrl}${sep}t=${Date.now()}`);
            setLoadingImg(true);

        } catch (error) {
            console.error('Error loading image:', error);
            setLoadingImg(false);
            setError(true);
        }
        // if (!imageUrl) {
        //     setIsLoading(false);
        //     setError(true);
        //     return;
        // }

        // let isMounted = true;
        // const img = new Image();
        // let retryTimer: NodeJS.Timeout;
        // let retryCount = 0;
        // const maxRetries = 2;

        // const loadImage = (url: string, attempt: number) => {
        //     img.onload = () => {
        //         if (!isMounted) {
        //             return;
        //         }
        //         setIsLoading(false);
        //         setError(false);
        //         setImgSrc(url);
        //     };

        //     img.onerror = (event) => {
        //         console.error('Image load error:', {
        //             url,
        //             attempt,
        //             event: event,
        //             error: event
        //         });
        //         if (retryCount < maxRetries) {
        //             retryCount++;
        //             retryTimer = setTimeout(() => {
        //                 const separator = url.includes('?') ? '&' : '?';
        //                 loadImage(`${url.split('?')[0]}${separator}t=${Date.now()}`, attempt + 1);
        //             }, 1000 * Math.pow(2, retryCount));
        //         } else if (isMounted) {
        //             setIsLoading(false);
        //             setError(true);
        //         }
        //     };

        //     try {
        //         img.src = url;
        //         // Force browser to actually load the image
        //         img.loading = 'eager';
        //     } catch (err) {
        //         if (isMounted) {
        //             setError(true);
        //             setIsLoading(false);
        //         }
        //     }
        // };

        // loadImage(imageUrl, 1);
        // return () => {
        //     isMounted = false;
        //     img.onload = null;
        //     img.onerror = null;
        //     clearTimeout(retryTimer);
        // };

        // }, [imageUrl]);
    }, [avatarBaseUrl, authLoading]);

    // if (isLoading) {
    //     return <Skeleton variant="circular" width={40} height={40} />;
    // }


    if (authLoading || loadingImg) {
        return <Skeleton variant="circular" width={40} height={40} />;
    }

    if (!imgSrc || error) {
        return <AccountCircle style={{ width: 40, height: 40 }} />;
    }

    // return (
    //     <>
    //         {imgSrc && !error ? (
    //             <img
    //                 src={imgSrc}
    //                 alt="Profile"
    //                 style={{
    //                     width: 40,
    //                     height: 40,
    //                     borderRadius: '50%',
    //                     objectFit: 'cover'
    //                 }}
    //                 loading="lazy"
    //             />
    //         ) : (
    //             <AccountCircle style={{ width: 40, height: 40 }} />
    //         )}
    //     </>
    // );


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