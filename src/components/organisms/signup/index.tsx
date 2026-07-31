import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
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
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import SocialLoginButtons from '@/components/molecules/social-login-buttons';

export default function SignUpForm({ theme }: { theme?: any } = {}) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const auth = useAuth();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo es inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await auth.signUpWithEmail(formData.email, formData.password, {
        full_name: formData.name,
        phone: formData.phone,
      });
      setIsSuccess(true);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Falla al crear la cuenta');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
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
            textAlign: 'center',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" color="success.main" gutterBottom>
              Verifica tu email
            </Typography>
            <Typography variant="body1" color="text.primary">
              Hemos enviado un enlace de verificación a <strong>{formData.email}</strong>.
              Por favor, revisa tu bandeja de entrada y verifica tu email para continuar.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            fullWidth
            sx={{ mt: 2 }}
          >
            Volver al inicio de sesión
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        backgroundColor: '#1B1B1B',
        borderRadius: 6,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 1,
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={2}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary" gutterBottom>
            ¡Comencemos!
          </Typography>
          <Typography variant="body1" color="text.primary">
            Regístrate para continuar
          </Typography>
        </Box>

        {authError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {authError}
          </Alert>
        )}

        {/* Social Login Buttons */}
        <SocialLoginButtons
          onGoogleLogin={() => auth.signInWithGoogle()}
        />

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.primary">
            O
          </Typography>
        </Divider>

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={1}>
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
              label="Teléfono"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
              size="medium"
              placeholder="Ej: 70123456"
            />

            <TextField
              fullWidth
              label="Correo electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
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
              error={!!errors.password}
              helperText={errors.password}
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

            <TextField
              fullWidth
              label="Confirmar contraseña"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              required
              variant="outlined"
              size="medium"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                mt: 2,
              }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Crear cuenta'}
            </Button>
          </Stack>
        </form>

        {/* Sign in link */}
        <Box textAlign="center" mt={3}>
          <Typography variant="body2" color="text.primary">
            ¿Ya tienes una cuenta?{' '}
            <MuiLink
              component={Link}
              to="/login"
              color={theme?.palette?.primary?.main || 'primary'}
              fontWeight="medium"
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Iniciar sesión
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}