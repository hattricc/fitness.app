import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { supabase } from '@/lib/supabase';

const MANUAL_SESSION_KEY = "manual_supabase_session_v1";

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

                // Verifica que el token realmente sea válido antes de persistirlo
                const { data: verified, error: verifyErr } = await supabase.auth.getUser(data.session.access_token);
                if (verifyErr || !verified?.user) {
                    throw verifyErr || new Error('Token verification failed after callback');
                }

                // Guarda lo mínimo necesario para restaurar sesión
                const s = data.session;
                localStorage.setItem(
                    MANUAL_SESSION_KEY,
                    JSON.stringify({
                        access_token: s.access_token,
                        refresh_token: s.refresh_token,
                        expires_at: s.expires_at,
                        user: { id: s.user?.id }, // opcional
                        saved_at: Date.now(),
                    })
                );

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