// src/components/auth/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { supabase } from "../../../src/lib/supabase";

export const AuthCallback = ({ setSession }: { setSession: (user: any) => void }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuth = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const error = urlParams.get('error');
            const errorDescription = urlParams.get('error_description');
            debugger
            if (error) {
                console.error('OAuth error:', { error, errorDescription });
                navigate('/login', {
                    state: {
                        error: errorDescription || 'Authentication failed. Please try again.'
                    },
                    replace: true
                });
                return;
            }

            // try {
            //     const result = await supabase.auth.getSession();
            //     console.log(result);
            // } catch (err) {
            //     console.error('Supabase getSession error:', err);
            // }

            try {
                // This will parse the URL hash and set the session
                const { data: { session }, error: authError } = await supabase.auth.getSession();
                if (authError) throw authError;
                if (error) throw error;

                if (session) {
                    setSession(session);

                    const wasOnSubscriptionPage = localStorage.getItem('wasOnSubscriptionPage') === 'true';
                    localStorage.removeItem('wasOnSubscriptionPage');

                    if (wasOnSubscriptionPage) {
                        navigate('/subscription', { replace: true });
                        return;
                    }

                    const urlParams = new URLSearchParams(window.location.search);
                    const next = urlParams.get('next') || '/';
                    navigate(next.startsWith('/') ? next : `/${next}`, { replace: true });
                } else {
                    throw new Error('No session found');
                }
            } catch (error) {
                console.error('Authentication error:', error);
                navigate('/login', {
                    state: {
                        error: 'Failed to authenticate. Please try again.'
                    },
                    replace: true
                });
            }
        };

        handleAuth();
    }, [navigate, setSession]);

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
            <Typography variant="h6">Completing authentication...</Typography>
        </Box>
    );
};

export default AuthCallback;