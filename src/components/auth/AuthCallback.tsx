// src/components/auth/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { supabase } from "../../../src/lib/supabase";

export const AuthCallback = ({ setSession }: { setSession: (user: any) => void }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuth = async () => {
            try {
                // This will parse the URL hash and set the session
                const { data: { session }, error } = await supabase.auth.getSession();
                console.log(session)
                
                if (error) throw error;
                
                if (session) {
                    setSession(session);

                    console.log('usuario iniciado sesion, redireccionar al inicio')
                    // Successfully logged in, redirect to home or intended page
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
            <Typography variant="h6">Completing authentication...</Typography>
        </Box>
    );
};

export default AuthCallback;