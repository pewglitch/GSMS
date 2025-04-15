import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [userType, setUserType] = useState('customer');
  const [formData, setFormData] = useState({
    Billing_Email: '',
    License_Number: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setError('');
    setFormData({ Billing_Email: '', License_Number: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload;
    if (userType === 'customer') {
      payload = {
        userType: 'customer',
        Billing_Email: formData.Billing_Email
      };
    } else {
      payload = {
        userType: 'publisher',
        License_Number: formData.License_Number
      };
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Store user data and cart ID in auth context
      login({
        id: userType === 'customer' ? data.user.customer_id : data.user.publisher_id,
        userType: userType,
        cartId: data.cart?.cart_id
      });
      
      // Redirect to games page
      navigate('/games');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* User Type Selection */}
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Login as:</Typography>
            <Button
              variant={userType === 'customer' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => handleUserTypeChange({ target: { value: 'customer' } })}
              sx={{ mr: 1 }}
            >
              Customer
            </Button>
            <Button
              variant={userType === 'publisher' ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => handleUserTypeChange({ target: { value: 'publisher' } })}
            >
              Publisher
            </Button>
          </Box>

          <form onSubmit={handleSubmit}>
            {userType === 'customer' && (
              <TextField
                fullWidth
                label="Billing Email"
                name="Billing_Email"
                type="email"
                value={formData.Billing_Email}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            )}
            {userType === 'publisher' && (
              <TextField
                fullWidth
                label="License Number"
                name="License_Number"
                value={formData.License_Number}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Button
                color="primary"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

