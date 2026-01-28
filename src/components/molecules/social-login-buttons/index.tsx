import { Button, Stack, useTheme } from '@mui/material';
import { Facebook, Google } from '@mui/icons-material';
import { Theme } from '@mui/material/styles';
import GoogleSignInButton from '../../atoms/google-sign-in-button';

interface SocialLoginButtonsProps {
  theme?: Theme;
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  onBiometricLogin?: () => void;
}

export default function SocialLoginButtons({
  onGoogleLogin,
  onFacebookLogin,
  onBiometricLogin,
}: SocialLoginButtonsProps) {
  const theme = useTheme();
  return (
    <Stack spacing={2} mb={3}>
      {onGoogleLogin &&
        <GoogleSignInButton onClick={onGoogleLogin} />
      }

      {
        onFacebookLogin && <Button
          variant="outlined"
          startIcon={<Facebook color="primary" />}
          fullWidth
          onClick={onFacebookLogin}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            borderColor: 'divider',
            color: theme.palette.text.primary,
            '&:hover': {
              borderColor: theme.palette.text.primary,
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Continuar con Facebook
        </Button>
      }

      {
        onBiometricLogin && <Button
          variant="outlined"
          fullWidth
          onClick={onBiometricLogin}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            borderColor: 'divider',
            color: theme.palette.text.primary,
            '&:hover': {
              borderColor: theme.palette.text.primary,
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Usar Biometria
        </Button>
      }
    </Stack >
  );
}
