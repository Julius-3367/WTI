import React, { useState } from 'react';
import { Box, Typography, Link, Paper, Button, Divider, Stepper, Step, StepLabel } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AuthLayout from './AuthLayout';
import RegisterForm from '../../features/auth/components/Register';

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
    <Typography variant="body2" color="text.secondary" sx={{ px: 2, whiteSpace: 'nowrap' }}>
      {children}
    </Typography>
    <Divider sx={{ flexGrow: 1 }} />
  </Box>
);

const steps = ['Account', 'Profile', 'Verification'];

const RegisterPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    
    const newActiveStep = isLastStep() && !allStepsCompleted()
      ? steps.findIndex((step, i) => !(i in completed))
      : activeStep + 1;
    
    setActiveStep(newActiveStep);
  };

  return (
    <AuthLayout>
      <StyledPaper elevation={0}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography component="h1" variant="h4" gutterBottom fontWeight="bold">
            Create an Account
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Join our platform to access amazing opportunities
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <SocialButton
            variant="outlined"
            startIcon={<Box component="img" src="/icons/google.svg" alt="Google" sx={{ width: 20, height: 20 }} />}
            className="social-button google"
            fullWidth
          >
            Continue with Google
          </SocialButton>
          
          <DividerWithText>or register with email</DividerWithText>
          
          <RegisterForm onSuccess={handleNext} />
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link 
              component={RouterLink} 
              to="/login" 
              color="primary"
              fontWeight="medium"
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Sign in
            </Link>
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              By registering, you agree to our{' '}
              <Link href="/terms" color="primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" color="primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Privacy Policy
              </Link>
            </Typography>
          </Box>
        </Box>
      </StyledPaper>
    </AuthLayout>
  );
};

export default RegisterPage;
