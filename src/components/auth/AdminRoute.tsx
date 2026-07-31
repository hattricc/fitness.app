import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useEnsureProfileFromEdge } from '@/modules/auth/application/hooks/useEnsureProfileFromEdge';

type AdminRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export const AdminRoute = ({
  children,
  redirectTo = '/',
}: AdminRouteProps) => {
  const { user, subscriptionLoading } = useAuth();
  const { ensureProfile } = useEnsureProfileFromEdge();
  const navigate = useNavigate();
  const [roleLoading, setRoleLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (subscriptionLoading || !user) return;

    let cancelled = false;
    setRoleLoading(true);

    ensureProfile().then((result) => {
      if (cancelled) return;
      setIsAdmin(result?.profile?.role === 'admin');
      setRoleLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user, subscriptionLoading, ensureProfile]);

  useEffect(() => {
    if (subscriptionLoading || roleLoading) return;
    if (!user || !isAdmin) {
      navigate(redirectTo);
    }
  }, [user, isAdmin, subscriptionLoading, roleLoading, navigate, redirectTo]);

  if (subscriptionLoading || roleLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};
