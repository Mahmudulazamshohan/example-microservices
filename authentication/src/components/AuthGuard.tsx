import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './query/useAuth';
import { Backdrop, CircularProgress } from '@mui/material';
import { useEffect } from 'react';

const AuthGuard: React.FC = () => {
  const { user, isLoading, error } = useAuth();
  useEffect(() => {
    console.log('Error', error);
  }, [error]);

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthGuard;
