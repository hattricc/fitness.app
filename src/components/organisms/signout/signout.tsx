import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
} from '@mui/material';
import { useAuth } from '../../../contexts/auth/AuthProvider.tsx';

export default function SignOut({ theme }: { theme?: any } = {}) {
  const navigate = useNavigate();

  const auth = useAuth();

  const handleSignOut = () => {
    auth.signOut();
    navigate('/');
  };

  useEffect(() => {
    setTimeout(() => {
      handleSignOut();
    }, 500);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      CERRANDO SESION
    </Box>
  );
}