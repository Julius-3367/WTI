import React from 'react';
import { Box, Typography, Link, Paper, Button, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AuthLayout from './AuthLayout';
import LoginForm from '../../features/auth/components/Login';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 12,
  boxShadow: theme.shadows[3],
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: theme.palette.primary.main,
  },
}));

const SocialButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: '10px 16px',
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 500,
  marginBottom: theme.spacing(2),
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1.5),
  },
}));

const DividerWithText = ({ children }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
    <Divider sx={{ flexGrow: 1 }} />
    <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
      {children}
    </Typography>
    <Divider sx={{ flexGrow: 1 }} />
  </Box>
);

const LoginPage = () => {
  return (
    <AuthLayout>
      <StyledPaper elevation={0}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography component="h1" variant="h4" gutterBottom fontWeight="bold">
            Welcome Back
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Sign in to access your account
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <SocialButton
            variant="outlined"
            startIcon={<Box component="img" src="/icons/google.svg" alt="Google" sx={{ width: 20, height: 20 }} />}
            className="social-button google"
          >
            Continue with Google
          </SocialButton>
          
          <DividerWithText>or</DividerWithText>
          
          <LoginForm />
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link 
              component={RouterLink} 
              to="/register" 
              color="primary"
              fontWeight="medium"
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Create an account
            </Link>
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Link 
              component={RouterLink} 
              to="/forgot-password" 
              variant="body2" 
              color="primary"
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Forgot password?
            </Link>
          </Box>
        </Box>
      </StyledPaper>
    </AuthLayout>
  );
};

export default LoginPage;
