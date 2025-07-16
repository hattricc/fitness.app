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

export default function SignUpForm({ theme }: { theme?: any } = {}) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registro attempt with:', formData);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          p: 4,
          boxShadow: 3,
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            ¡Comencemos!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Registrate para continuar con FitnessApp
          </Typography>
        </Box>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              variant="outlined"
              size="medium"
            />

            <TextField
              fullWidth
              label="Número de telefono"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              required
              variant="outlined"
              size="medium"
            />

            <TextField
              fullWidth
              label="Email or Username"
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
              label="Password"
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
              Registrarme
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        {/* Social Login Buttons */}
        <SocialLoginButtons
          onGoogleLogin={() => console.log('Google login clicked')}
          onFacebookLogin={() => console.log('Facebook login clicked')}
          onBiometricLogin={() => console.log('Biometric login clicked')}
        />
        

        {/* Sign up link */}
        <Box textAlign="center" mt={2}>
          <Typography variant="body2" color="text.secondary">
            ¿Ya tienes una cuenta?{' '}
            <MuiLink 
              component="button" 
              type="button" 
              color={theme.palette.primary.main} 
              fontWeight="medium"
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}