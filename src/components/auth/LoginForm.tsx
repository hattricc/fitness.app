import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useAuthForm } from '@/hooks/useAuthForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { GoogleIcon } from '@/components/icons/GoogleIcon';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const { values, errors, isSubmitting, handleChange, setErrors, setIsSubmitting, validate } = useAuthForm({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      await signInWithEmail(values.email, values.password);
      navigate('/dashboard');
    } catch (error) {
      setAuthError('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setAuthError('Failed to sign in with Google');
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground mt-2">Enter your credentials to access your account</p>
      </div>

      <div className="space-y-4">
        <Button
          type="button"
          variant="outlined"
          size="medium"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
        >
          <GoogleIcon className="w-4 h-4 mr-2" />
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {authError && (
          <div className="rounded-md bg-destructive/15 p-4">
            <p className="text-sm text-destructive">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            disabled={isSubmitting}
            autoComplete="email"
          /> */}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" variant="contained" size="medium" className="w-full" isLoading={isSubmitting}>
            Sign in
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <a href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
};
