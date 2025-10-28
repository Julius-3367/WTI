import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { logoutUser } from '../../features/auth/authThunks';

/**
 * Logout page component
 * Handles user logout and redirects to login
 */
const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await dispatch(logoutUser()).unwrap();
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('Logout error:', error);
        // Even if logout fails, redirect to login
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [dispatch, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={48} />
      <Typography variant="h6" color="text.secondary">
        Signing out...
      </Typography>
    </Box>
  );
};

export default Logout;
