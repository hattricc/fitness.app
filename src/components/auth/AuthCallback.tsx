import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

export const AuthCallback = () => {
    const navigate = useNavigate();

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
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
                    if (exchangeError) throw exchangeError;
                }

                const { data, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;
                if (!data.session) throw new Error("No session found after OAuth callback");

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

        handleAuth();
    }, [navigate]);

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