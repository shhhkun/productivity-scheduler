import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';

export default function AuthScreen({
  loginEmail,
  setLoginEmail,
  loginPass,
  setLoginPass,
  logIn,
  signUp,
}) {
  const [step, setStep] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [greeting, setGreeting] = useState('');

  const handleNext = () => {
    if (loginEmail.trim()) setStep('password');
  };

  const handleBack = () => {
    setStep('email');
    setLoginPass('');
  };

  const getLoginGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 5) return 'Burning the midnight oil?';
    if (hour < 12) return 'Good morning. Let’s plan your day.';
    if (hour < 17) return 'Good afternoon. Let’s get things organized.';
    if (hour < 21) return 'Good evening. What’s left for today?';
    return 'Late night hustle?';
  };

  useEffect(() => {
    setGreeting(getLoginGreeting());
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)', // Dark blue background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        p: 2,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          mb: 2,
          mt: 24,
          width: '100%',
          maxWidth: 420,
          color: 'var(--text2)',
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Kept
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'var(--text3)',
          }}
        >
          {greeting}
        </Typography>
      </Box>

      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
          backgroundColor: 'var(--card-bg)', // Slightly lighter container
          color: 'var(--text2)', // Light gray text
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          {step === 'email' ? 'Sign in' : 'Welcome Back'}
        </Typography>

        {step === 'email' ? (
          <>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              autoFocus
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              sx={{
                mb: 3,
                input: {
                  color: 'var(--text2)',
                  backgroundColor: 'transparent',
                  '&:-webkit-autofill': {
                    transition: 'background-color 9999s ease-out 0s',
                    WebkitTextFillColor: 'var(--text2)',
                  },
                },
                label: {
                  color: 'rgb(156, 163, 175)',
                  '&.Mui-focused': {
                    color: 'var(--accent)',
                  },
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgb(75, 85, 99)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--accent)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--accent)',
                  },
                },
              }}
              InputLabelProps={{ shrink: true }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={handleNext}
              sx={{
                backgroundColor: 'var(--button-bg)',
                color: 'var(--text)',
                fontWeight: 600,
                textTransform: 'none',
                mb: 1.5,
                '&:hover': {
                  backgroundColor: 'var(--hover)',
                },
              }}
            >
              Next
            </Button>

            <Button
              onClick={() => signUp(loginEmail, loginPass)}
              sx={{
                color: 'var(--accent)',
                backgroundColor: 'transparent',
                textTransform: 'none',
                fontSize: '0.875rem',
              }}
            >
              Create account
            </Button>
          </>
        ) : (
          <>
            <Box display="flex" alignItems="center" mb={2}>
              <IconButton
                onClick={handleBack}
                sx={{ color: 'var(--button-bg)' }}
              >
                <ArrowBack />
              </IconButton>
              <Typography sx={{ ml: 1 }}>Enter your password</Typography>
            </Box>

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              sx={{
                mb: 3,
                input: {
                  color: 'var(--text2)',
                  backgroundColor: 'transparent',
                  '&:-webkit-autofill': {
                    transition: 'background-color 9999s ease-out 0s',
                    WebkitTextFillColor: 'var(--text2)',
                  },
                },
                label: {
                  color: 'rgb(156, 163, 175)',
                  '&.Mui-focused': {
                    color: 'var(--accent)',
                  },
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgb(75, 85, 99)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--accent)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--accent)',
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      sx={{ color: 'var(--button-bg)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={() => logIn(loginEmail, loginPass)}
              sx={{
                backgroundColor: 'var(--button-bg)',
                color: 'var(--text)',
                fontWeight: 600,
                textTransform: 'none',
                mb: 1.5,
                '&:hover': {
                  backgroundColor: 'var(--hover)',
                },
              }}
            >
              Sign In
            </Button>

            <Button
              onClick={() => signUp(loginEmail, loginPass)}
              sx={{
                color: 'var(--accent)',
                textTransform: 'none',
                fontSize: '0.875rem',
              }}
            >
              Create account
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
