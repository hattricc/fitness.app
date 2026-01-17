import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useAuthForm } from '@/hooks/useAuthForm';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { MakButton } from '@/components/ui/MakButton';
import { MakInput } from '@/components/ui/MakInput';

export const SignupForm = () => {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { values, errors, isSubmitting, handleChange, setErrors, setIsSubmitting, validate } = useAuthForm({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateSignup = () => {
    const isValid = validate();
    if (values.password !== values.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
      return false;
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!validateSignup()) return;
    
    try {
      setIsSubmitting(true);
      await signUpWithEmail(values.email, values.password);
      setIsSuccess(true);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setAuthError('Failed to sign up with Google');
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Revisa tu correo</h2>
        <p className="text-muted-foreground">
          Hemos enviado un link de verificación a <span className="font-medium">{values.email}</span>.
          Por favor revisa tu bandeja y verifica tu correo para continuar.
        </p>
        <MakButton onClick={() => navigate('/login')} className="mt-4">
          Volver al inicio de sesión
        </MakButton>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Crear una cuenta</h1>
        <p className="text-muted-foreground mt-2">
          Ingresa tus datos para comenzar
        </p>
      </div>

      <div className="space-y-4">
        <MakButton
          type="button"
          variant="outlined"
          size="medium"
          className="w-full"
          onClick={handleGoogleSignUp}
          disabled={isSubmitting}
        >
          <GoogleIcon className="w-4 h-4 mr-2" />
          Registrarse con Google
        </MakButton>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              O continúa con correo electrónico
            </span>
          </div>
        </div>

        {authError && (
          <div className="rounded-md bg-destructive/15 p-4">
            <p className="text-sm text-destructive">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <MakInput
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            disabled={isSubmitting}
            autoComplete="email"
          />

          <MakInput
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          <MakInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          <MakButton type="submit" className="w-full" isLoading={isSubmitting}>
            Crear cuenta
          </MakButton>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
};
