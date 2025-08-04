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
  FormControlLabel,
  Checkbox,
  Divider,
  Link
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const Signup = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Signup failed. Please try again.');
        return;
      }

      setMessage('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      console.error(err);
      setMessage('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: '16px' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            ThreadRate
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join the fashion community
          </Typography>
        </Box>

        <Typography variant="h5" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}>
          Create Your Account
        </Typography>

        {message && (
          <Alert
            severity={message.includes('successfully') ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            name="username"
            label="Username"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

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

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Create a password"
            type="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm your password"
            type="password"
            id="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            error={form.confirmPassword !== '' && form.password !== form.confirmPassword}
            helperText={
              form.confirmPassword !== '' && form.password !== form.confirmPassword
                ? 'Passwords do not match'
                : ''
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            sx={{ mt: 1 }}
            control={<Checkbox value="accept" color="primary" required />}
            label={
              <Typography variant="body2">
                I agree to the{' '}
                <Link href="#" variant="body2">Terms of Service</Link>
                {' '}and{' '}
                <Link href="#" variant="body2">Privacy Policy</Link>
              </Typography>
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 2, mb: 2, py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
          </Button>

          <Divider sx={{ my: 2 }}>or continue with</Divider>

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

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" sx={{ fontWeight: 500 }}>
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;
