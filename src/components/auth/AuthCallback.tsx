import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthProvider';

const MANUAL_SESSION_KEY = "manual_supabase_session_v1";

export const AuthCallback = () => {
    const navigate = useNavigate();
    const { user, authLoading } = useAuth();

    const [checkAuth, setCheckAuth] = useState<NodeJS.Timeout | undefined>( );

    useEffect(() => {
        const handleAuth = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const error = urlParams.get('error');
            const errorDescription = urlParams.get('error_description');
            const next = urlParams.get("next") || "/";

            if (error) {
                navigate('/login', {
                    state: {
                        error: errorDescription || 'Authentication failed. Please try again.'
                    },
                    replace: true
                });
                return;
            }

            try {
                // Si el callback trae ?code=..., esto es lo correcto en v2 (PKCE)
                if (urlParams.get("code")) {
                    console.log('[AuthCallback] Processing OAuth callback with code');

                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
                    if (exchangeError) throw exchangeError;


                    // Wait for AuthProvider to process the callback
                    let attempts = 0;
                    const maxAttempts = 10;

                    while (attempts < maxAttempts && authLoading) {
                        console.log(`[AuthCallback] Waiting for auth... attempt ${attempts + 1}`);
                        await new Promise(resolve => setTimeout(resolve, 500));
                        attempts++;
                    }

                    // Check if we have a user after the auth process
                    if (!user && !authLoading) {
                        console.error('[AuthCallback] No user found after auth processing');
                        throw new Error('Authentication failed - no user session established');
                    }

                    console.log('[AuthCallback] Auth successful, user:', user?.id);
                }

                const redirectTo = localStorage.getItem('redirectTo') || next;
                localStorage.removeItem('redirectTo');

                navigate(redirectTo.startsWith('/') ? redirectTo : `/${redirectTo}`, {
                    replace: true
                });
            } catch (error) {
                console.error('Authentication error:', error);
                navigate('/login', {
                    state: {
                        error: 'Failed to complete authentication. Please try again.'
                    },
                    replace: true
                });
            }
        };

        // Only run if we're not currently loading
        console.log('authLoading in AuthCallback', authLoading);
        if (!authLoading) {
            handleAuth();
        } else {
            setCheckAuth(setInterval(() => {
                if (!authLoading) {
                    clearInterval(checkAuth);
                    handleAuth();
                }
            }, 100));
        }

        return () => clearInterval(checkAuth);
    }, [navigate, user, authLoading]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                gap: 2,
            }}
        >
            <CircularProgress />
            <Typography variant="h6">Completando autenticación...</Typography>
        </Box>
    );
};

export default AuthCallback;