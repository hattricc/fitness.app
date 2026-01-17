import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
} from '@mui/material';

export default function ResetPasswordForm({ theme }: { theme?: any } = {}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Password reset requested for:', email);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        p: 1,
        backgroundColor: '#1B1B1B',
        borderRadius: 6,
      }}
    >
      <Box
        sx={{
          width: '100%',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '3vh'
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold" color='text.primary' gutterBottom>
            Restablecer contraseña
          </Typography>
          <Typography variant="body1" color="text.primary">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
          </Typography>
        </Box>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Correo electrónico"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
              size="medium"
            />
            
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Enviar
            </Button>
          </Stack>
        </form>

        {/* Back to login link */}
        <Box textAlign="center" mt={3}>
          <Typography variant="body2" color="text.primary">
            ¿Recordaste tu contraseña?{' '}
            <Button 
              variant="text" 
              size="small"
              onClick={() => navigate('/login')}
              sx={{
                textTransform: 'none',
                p: 0,
                minWidth: 'auto',
                color: theme.palette.primary.main,
                fontWeight: 'medium',
              }}
            >
              Iniciar sesión
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
