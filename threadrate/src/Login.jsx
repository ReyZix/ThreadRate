import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { FaGoogle, FaApple } from 'react-icons/fa';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider,
  Link
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Login failed. Please try again.');
        return;
      }

      localStorage.setItem('token', data.token);
      setMessage('Welcome back! Redirecting...');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      console.error(err);
      setMessage('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: '16px' }}>
        {/* Logo / Branding */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            ThreadRate
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back to the fashion community
          </Typography>
        </Box>

        <Typography variant="h5" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}>
          Sign In to Your Account
        </Typography>

        {/* Message Alert */}
        {message && (
          <Alert
            severity={message.includes('Welcome') ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Password Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Remember Me / Forgot Password */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Link component="button" variant="body2" type="button">
              Forgot password?
            </Link>
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 2, mb: 2, py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>

          {/* Divider */}
          <Divider sx={{ my: 2 }}>or continue with</Divider>

          {/* Social Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FaGoogle />}
              sx={{ py: 1.5 }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FaApple />}
              sx={{ py: 1.5 }}
            >
              Apple
            </Button>
          </Box>

          {/* Sign Up */}
          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link component={RouterLink} to="/signup" sx={{ fontWeight: 500 }}>
              Create one here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
