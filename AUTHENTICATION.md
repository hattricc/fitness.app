# Authentication System

This project uses Supabase for authentication with email/password and OAuth providers (Google, GitHub, etc.). The authentication system is built with React and TypeScript, providing a secure and user-friendly experience.

## Features

- Email/Password authentication
- Social logins (Google, GitHub, etc.)
- Protected routes
- User session management
- Form validation
- Responsive UI

## Setup

1. **Environment Variables**

   Create a `.env` file in the root of your project with the following variables:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Install Dependencies**

   ```bash
   npm install @supabase/supabase-js @radix-ui/react-dropdown-menu @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
   ```

## Usage

### 1. Wrap your app with AuthProvider

```tsx
import { AuthProvider } from '@/contexts/auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

### 2. Use the Login and Signup Forms

```tsx
import { LoginForm } from '@/components/auth';

export default function LoginPage() {
  return (
    <div className="container flex h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}
```

### 3. Protect Routes

```tsx
import { ProtectedRoute } from '@/components/auth';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

### 4. Access User Data

```tsx
import { useAuth } from '@/contexts/auth/AuthContext';

function UserProfile() {
  const { user } = useAuth();
  
  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      {/* User content */}
    </div>
  );
}
```

## Components

### LoginForm

A form component for user login with email/password and social login options.

**Props:** None

### SignupForm

A form component for user registration with email/password and social signup options.

**Props:** None

### ProtectedRoute

A wrapper component that protects routes from unauthorized access.

**Props:**
- `children`: ReactNode - The content to protect
- `redirectTo`: string (default: '/login') - The path to redirect to if not authenticated

### UserMenu

A dropdown menu component that shows user information and actions.

**Props:** None

## Hooks

### useAuth

A custom hook that provides authentication methods and user state.

**Returns:**
- `user`: User | null - The current user object
- `loading`: boolean - Loading state
- `signInWithEmail`: (email: string, password: string) => Promise<void>
- `signUpWithEmail`: (email: string, password: string) => Promise<void>
- `signInWithGoogle`: () => Promise<void>
- `signOut`: () => Promise<void>

## Styling

The authentication components use Tailwind CSS for styling. You can customize the look and feel by:

1. Modifying the `tailwind.config.js` file
2. Adding custom CSS classes to the components
3. Using the `className` prop to override styles

## Error Handling

All authentication methods throw errors that can be caught and handled in your components. Common errors include:

- Invalid email or password
- Email already in use
- Weak password
- Network errors

## Adding More OAuth Providers

To add more OAuth providers (GitHub, Twitter, etc.):

1. Enable the provider in your Supabase dashboard
2. Add a new method in the `AuthContext`:

```typescript
const signInWithGitHub = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  });
  if (error) throw error;
};
```

3. Add the method to the context value
4. Add a new button to the login/signup forms

## Testing

To test the authentication flow:

1. Run the development server
2. Navigate to `/login`
3. Try signing up with a new account
4. Verify your email
5. Log out and log back in
6. Test protected routes

## Security Considerations

- Always use HTTPS in production
- Keep your Supabase keys secure
- Implement proper error handling
- Use strong password policies
- Enable email verification for production
- Consider implementing rate limiting
- Keep dependencies up to date
