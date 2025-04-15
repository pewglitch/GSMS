import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [userType, setUserType] = useState('customer');
  const [formData, setFormData] = useState({
    Name: '',
    Billing_Email: '',
    Payment_Method: 'Credit',
    License_Number: '',
    Type: 'Company'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setError('');
    // Reset form fields for the other type
    setFormData({
      Name: '',
      Billing_Email: '',
      Payment_Method: 'Credit',
      License_Number: '',
      Type: 'Company'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload;
    if (userType === 'customer') {
      payload = {
        userType: 'customer',
        Name: formData.Name,
        Billing_Email: formData.Billing_Email,
        Payment_Method: formData.Payment_Method
      };
    } else {
      payload = {
        userType: 'publisher',
        License_Number: formData.License_Number,
        Type: formData.Type
      };
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      // Optionally, log the user in or redirect
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Register
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* User Type Selection */}
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Register as:</Typography>
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
              <>
                <TextField
                  fullWidth
                  label="Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
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
                <TextField
                  fullWidth
                  select
                  label="Payment Method"
                  name="Payment_Method"
                  value={formData.Payment_Method}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="Credit">Credit Card</MenuItem>
                  <MenuItem value="Debit">Debit Card</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="PayPal">PayPal</MenuItem>
                </TextField>
              </>
            )}
            {userType === 'publisher' && (
              <>
                <TextField
                  fullWidth
                  label="License Number"
                  name="License_Number"
                  value={formData.License_Number}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  select
                  label="Type"
                  name="Type"
                  value={formData.Type}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="Company">Company</MenuItem>
                  <MenuItem value="Individual">Individual</MenuItem>
                </TextField>
              </>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              Register
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Button
                color="primary"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

