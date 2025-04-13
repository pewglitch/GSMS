import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
  Alert,
  Grid,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    identifier: '',
    userType: 'customer',
    name: '',
    paymentMethod: 'Credit',
    type: 'Company',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userType', data.userType);

      navigate(formData.userType === 'publisher' ? '/publisher-dashboard' : '/games');
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

          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <RadioGroup
                row
                name="userType"
                value={formData.userType}
                onChange={handleChange}
              >
                <FormControlLabel value="customer" control={<Radio />} label="Customer" />
                <FormControlLabel value="publisher" control={<Radio />} label="Publisher" />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label={formData.userType === 'publisher' ? 'License Number' : 'Billing Email'}
              type={formData.userType === 'publisher' ? 'text' : 'email'}
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label={formData.userType === 'publisher' ? 'Organization Name' : 'Full Name'}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            {formData.userType === 'customer' ? (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  label="Payment Method"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Credit">Credit</MenuItem>
                  <MenuItem value="Debit">Debit</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="PayPal">PayPal</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Publisher Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Publisher Type"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Company">Company</MenuItem>
                  <MenuItem value="Individual">Individual</MenuItem>
                </Select>
              </FormControl>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
            >
              Register
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Button color="primary" onClick={() => navigate('/login')}>
                Login
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
