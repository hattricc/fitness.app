import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  IconButton,
  Link as MuiLink,
  Stack,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import SocialLoginButtons from '../../molecules/social-login-buttons';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/auth/AuthContext';


interface LoginFormProps {
  title?: string;
  subtitle?: string;
  inSubscriptionPage?: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export default function LoginForm({ title, subtitle, inSubscriptionPage = false, onSuccess, onClose }: LoginFormProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const auth = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    console.log('Login attempt with:', formData);
    onSuccess();
  };

  const handleLogin = (login: (e?: React.FormEvent) => void, e?: React.FormEvent) => {
    localStorage.setItem('wasOnSubscriptionPage', 'true');
    
    login(e);
  };

  return (
    <Box
      sx={{
        // minHeight: '100vh',
        // minHeight: '50vh',
        display: 'flex',
        // flexDirection: 'column',
        // alignItems: 'center',
        p: 1,
        backgroundColor: '#1B1B1B',
        borderRadius: 6,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
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
            {title || '¡Bienvenido de vuelta!'}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {subtitle || 'Inicia sesión o regístrate con Google para continuar con Luis Suarez F4F'}
          </Typography>
        </Box>

        {/* Login Form */}
        <form onSubmit={(e) => handleLogin(handleSubmit, e)}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Usuario o correo"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              size="medium"
            />

            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              variant="outlined"
              size="medium"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* <Box sx={{ textAlign: 'right' }}>
              <MuiLink 
                component="button" 
                type="button" 
                variant="body2" 
                color={theme.palette.primary.main}
                onClick={() => navigate('/reset-password')}
              >
                ¿Olvidaste tu contraseña?
              </MuiLink>
            </Box> */}

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
              Iniciar sesión
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.primary">
            O
          </Typography>
        </Divider>

        {/* Social Login Buttons */}
        <SocialLoginButtons
          onGoogleLogin={() => handleLogin(auth.signInWithGoogle)}
        />

        {/* Sign up link */}
        {/* <Box textAlign="center" mt={2}>
          <Typography variant="body2" color="text.primary">
            ¿No tienes una cuenta?{' '}
            <MuiLink 
              component="button" 
              type="button" 
              color={theme.palette.primary.main} 
              fontWeight="medium"
              onClick={() => navigate('/signup')}
            >
              Registrate
            </MuiLink>
          </Typography>
        </Box> */}
      </Box>
    </Box>
  );
}