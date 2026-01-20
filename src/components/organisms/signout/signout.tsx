import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useAuth } from '../../../contexts/auth/AuthProvider.tsx';

export default function SignOut() {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');

    } catch (error) {
      console.error('SignOut error:', error);
    }
  };

  // Auto sign out after 500ms (remove this if you want instant sign out)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSignOut();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '60vh',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2',
        flexDirection: 'column',
      }}
    >
      <CircularProgress size={36} className='mb-4' />

      <Typography variant="h6">Cerrando sesión</Typography>
    </Box>
  );
}