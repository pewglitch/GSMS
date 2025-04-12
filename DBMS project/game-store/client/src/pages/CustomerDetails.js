import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ShoppingCart as CartIcon,
  ReceiptLong as OrdersIcon,
  Email as EmailIcon,
  CreditCard as CreditCardIcon
} from '@mui/icons-material';
import { getCustomerById } from '../services/api';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const customerData = await getCustomerById(id);
        setCustomer(customerData);
        setLoading(false);
      } catch (error) {
        setError(`Failed to load customer details for ID: ${id}`);
        setLoading(false);
        console.error('Error fetching customer details:', error);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Get payment method color
  const getPaymentMethodColor = (method) => {
    const colors = {
      'Credit': '#2196f3',
      'Debit': '#4caf50',
      'UPI': '#ff9800',
      'PayPal': '#9c27b0'
    };
    
    return colors[method] || '#9e9e9e';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !customer) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button startIcon={<BackIcon />} onClick={handleGoBack} sx={{ mb: 2 }}>
          Back to Customers
        </Button>
        <Paper sx={{ p: 3 }}>
          <Typography color="error" variant="h6">{error || 'Customer not found'}</Typography>
          <Typography>The requested customer could not be found or there was an error loading the data.</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<BackIcon />} onClick={handleGoBack} sx={{ mb: 2 }}>
        Back to Customers
      </Button>
      
      <Typography variant="h4" gutterBottom>
        Customer Details
      </Typography>
      
      <Grid container spacing={4}>
        {/* Customer Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {customer.Name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  {customer.Billing_Email}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CreditCardIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Chip 
                  label={customer.Payment_Method} 
                  size="small" 
                  sx={{ 
                    bgcolor: getPaymentMethodColor(customer.Payment_Method),
                    color: 'white'
                  }} 
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CartIcon />}
                    component={Link}
                    to={`/cart/${customer.Customer_ID}`}
                  >
                    View Cart
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<OrdersIcon />}
                    component={Link}
                    to={`/orders/${customer.Customer_ID}`}
                  >
                    View Orders
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Customer Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customer Statistics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem divider>
                  <ListItemText 
                    primary="Customer ID" 
                    secondary={customer.Customer_ID} 
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemText 
                    primary="Total Orders" 
                    secondary="Data not available" 
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemText 
                    primary="Total Spent" 
                    secondary="Data not available" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Customer Since" 
                    secondary="Data not available" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerDetails; 